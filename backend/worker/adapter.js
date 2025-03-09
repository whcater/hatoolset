export function createAdapter(app) {
  return async (request) => {
    try {
      console.log(`处理请求: ${request.method} ${request.url}`);

      const url = new URL(request.url);

      // 检查是否是静态文件请求
      if (url.pathname.startsWith('/static/')) {
        // 从 R2 存储中获取文件
        const objectKey = url.pathname.replace('/static/', '');
        const object = await env.BUCKET.get(objectKey);

        if (object === null) {
          return new Response('Not Found', { status: 404 });
        }

        // 设置适当的 Content-Type
        const contentType = getContentType(objectKey);
        return new Response(object.body, {
          headers: {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=86400'
          }
        });
      }

      // 创建 Express 兼容的请求对象
      const expressReq = {
        method: request.method,
        url: url.pathname + url.search,
        path: url.pathname,
        query: Object.fromEntries(url.searchParams.entries()),
        params: {},
        headers: Object.fromEntries(request.headers.entries()),
        get: (header) => request.headers.get(header),
        db: request.db,
        // 添加流状态属性
        readable: true,
        flowing: true,  // 添加 flowing 属性
        readableFlowing: true,  // Node.js 新版本使用的属性
        // 流控制方法
        pause: () => {
          console.log('请求流 pause 被调用');
          expressReq.flowing = false;
          expressReq.readableFlowing = false;
          return expressReq;
        },
        resume: () => {
          console.log('请求流 resume 被调用');
          expressReq.flowing = true;
          expressReq.readableFlowing = true;
          return expressReq;
        },
        // 改进 pipe 相关属性
        pipe: (destination) => {
          console.log('请求流 pipe 被调用');
          expressReq.flowing = true;
          expressReq.readableFlowing = true;
          // 如果有请求体，可以尝试将其写入目标
          if (expressReq.body && typeof destination.write === 'function') {
            try {
              destination.write(
                typeof expressReq.body === 'string'
                  ? expressReq.body
                  : JSON.stringify(expressReq.body)
              );
            } catch (e) {
              console.error('Pipe 写入失败:', e);
            }
          }
          // 返回目标以支持链式调用
          return destination;
        },
        unpipe: (destination) => {
          console.log('请求流 unpipe 被调用');
          // 在 Worker 环境中，我们不需要实际断开管道
          return expressReq;
        },
        // 添加流相关属性
        on: (event, callback) => {
          console.log(`请求流 on(${event}) 被调用`);
          if (event === 'data' && expressReq._rawBody) {
            setTimeout(() => callback(expressReq._rawBody), 0);
          }
          if (event === 'end') {
            setTimeout(callback, 0);
          }
          return expressReq;
        },
        once: (event, callback) => {
          console.log(`请求流 once(${event}) 被调用`);
          // 类似于 on 方法，但确保回调只被调用一次
          return expressReq.on(event, callback);
        },
        emit: (event, ...args) => {
          console.log(`请求流 emit(${event}) 被调用`);
          return true;
        },
        // 更多 req 属性
        ip: request.headers.get('cf-connecting-ip') || '127.0.0.1',
        protocol: url.protocol.replace(':', ''),
        secure: url.protocol === 'https:',
        hostname: url.hostname,
        host: url.host,
        originalUrl: url.pathname + url.search,
        body: null,
        // 必要的方法
        accepts: () => true,
        acceptsEncodings: () => ['gzip', 'deflate'],
        acceptsLanguages: () => ['en'],
      };

      // 处理请求体
      if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
        const contentType = request.headers.get('content-type') || '';

        try {
          // 1. 克隆原始请求，这样我们就有了一个备份
          const clonedRequest = request.clone();

          // 2. 先尝试读取原始文本
          let rawText = await clonedRequest.text();
          console.log('收到的原始请求体:', rawText);

          // 3. 根据内容类型处理请求体
          if (contentType.includes('application/json')) {
            try {
              // 清理可能的控制字符
              // rawText = rawText
              //   .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // 移除控制字符
              //   .replace(/\r?\n/g, ' ')                        // 将换行转换为空格
              //   .replace(/\s+/g, ' ')                          // 合并多个空格
              //   .trim();

              if (rawText) {
                try {
                  expressReq.body = rawText;
                  JSON.parse(rawText);
                  console.log('成功解析JSON:', expressReq.body);
                } catch (parseError) {
                  console.error('JSON解析失败:', parseError);
                  // 如果解析失败，返回一个包含原始文本的对象
                  expressReq.body = {
                    _rawText: rawText,
                    _parseError: parseError.message
                  };
                }
              } else {
                console.log('请求体为空，使用空对象');
                expressReq.body = {};
              }
            } catch (e) {
              console.error('处理JSON请求体时出错:', e);
              expressReq.body = {};
            }
          } else if (contentType.includes('application/x-www-form-urlencoded')) {
            try {
              // 解析 URL 编码的表单数据
              const params = new URLSearchParams(rawText);
              expressReq.body = Object.fromEntries(params.entries());
              console.log('成功解析表单数据:', expressReq.body);
            } catch (e) {
              console.error('解析表单数据失败:', e);
              expressReq.body = {};
            }
          } else {
            // 对于其他内容类型，直接使用原始文本
            expressReq.body = rawText;
            console.log('使用原始文本作为请求体');
          }

          // 4. 添加原始请求体到请求对象，以便调试
          expressReq._rawBody = rawText;

        } catch (e) {
          console.error('处理请求体时发生严重错误:', e);
          expressReq.body = {};
          expressReq._error = e.message;
        }

        // 5. 添加请求体解析状态
        expressReq._bodyParsed = true;
        expressReq._contentLength = request.headers.get('content-length');
        expressReq._contentType = contentType;
      }

      // 创建 Express 兼容的响应对象
      let statusCode = 200;
      let responseHeaders = new Headers({
        'Content-Type': 'application/json'
      });
      let responseBody = '';
      let isResponseSent = false;
      let isHeadersSent = false;

      const expressRes = {
        status: (code) => {
          statusCode = code;
          return expressRes;
        },
        // 设置状态码的替代方法
        sendStatus: (code) => {
          statusCode = code;
          responseBody = String(code);
          isResponseSent = true;
          return expressRes;
        },
        // 设置头信息的方法
        set: (name, value) => {
          responseHeaders.set(name, value);
          return expressRes;
        },
        setHeader: (name, value) => {
          responseHeaders.set(name, value);
          return expressRes;
        },
        header: (name, value) => {
          responseHeaders.set(name, value);
          return expressRes;
        },
        get: (name) => responseHeaders.get(name),
        getHeader: (name) => responseHeaders.get(name),
        removeHeader: (name) => {
          responseHeaders.delete(name);
          return expressRes;
        },
        // 设置 content-type 的便捷方法
        contentType: (type) => {
          responseHeaders.set('Content-Type', type);
          return expressRes;
        },
        type: (type) => {
          responseHeaders.set('Content-Type', type);
          return expressRes;
        },
        // 响应数据方法
        json: (body) => {
          responseHeaders.set('Content-Type', 'application/json');
          if (body !== undefined) {
            responseBody = JSON.stringify(body);
          }
          isResponseSent = true;

          // 关键修复：在发送响应后自动完成请求
          if (!routeHandled) {
            console.log('json() 被调用，自动完成请求');
            // routeHandled = true;
            // 这里需要调用 resolve 函数，但它在 appExecution Promise 的作用域内
            // 我们需要确保这个 resolve 可以被访问
          }

          return expressRes;
        },
        send: (body) => {
          if (typeof body === 'object' && body !== null) {
            responseHeaders.set('Content-Type', 'application/json');
            responseBody = JSON.stringify(body);
          } else if (body !== undefined && body !== null) {
            responseBody = String(body);
          }
          isResponseSent = true;
          return expressRes;
        },
        end: (data) => {
          if (data !== undefined) {
            responseBody = String(data);
          }
          isResponseSent = true;
          return expressRes;
        },
        // 重定向方法
        redirect: (status, url) => {
          if (url === undefined) {
            url = status;
            status = 302;
          }
          statusCode = status;
          responseHeaders.set('Location', url);
          isResponseSent = true;
          return expressRes;
        },
        // 其他必要属性和方法
        headersSent: isHeadersSent,
        locals: {},
        app: app,
        req: expressReq,
        // 模拟 Express 的附加方法
        cookie: (name, value, options = {}) => {
          const cookieStr = `${name}=${value}`;
          responseHeaders.append('Set-Cookie', cookieStr);
          return expressRes;
        },
        clearCookie: (name) => {
          responseHeaders.append('Set-Cookie', `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`);
          return expressRes;
        },
        // 标记响应为已发送
        _markAsSent: () => {
          isResponseSent = true;
          isHeadersSent = true;
        },
        // 改进流相关方法
        pipe: (destination) => {
          console.log('响应流 pipe 被调用');
          // 如果有响应体，可以尝试将其写入目标
          if (responseBody && typeof destination.write === 'function') {
            try {
              destination.write(responseBody);
            } catch (e) {
              console.error('Pipe 写入失败:', e);
            }
          }
          // 返回目标以支持链式调用
          return destination;
        },
        unpipe: (destination) => {
          console.log('响应流 unpipe 被调用');
          // 在 Worker 环境中，我们不需要实际断开管道
          return expressRes;
        },
        // 添加更多流相关方法和属性
        writableEnded: false,
        writableFinished: false,
        writable: true,

        // 添加 on, once, emit 方法（与请求对象类似）
        on: (event, callback) => {
          console.log(`响应流 on(${event}) 被调用`);
          // 对于某些事件，立即触发回调
          if (event === 'finish' && isResponseSent) {
            setTimeout(callback, 0);
          }
          return expressRes;
        },

        once: (event, callback) => {
          console.log(`响应流 once(${event}) 被调用`);
          return expressRes.on(event, callback);
        },

        emit: (event, ...args) => {
          console.log(`响应流 emit(${event}) 被调用`);
          return true;
        },

        // 添加 write 方法
        write: (chunk) => {
          console.log(`响应流 write() 被调用`);
          if (typeof chunk === 'string') {
            responseBody += chunk;
          } else if (Buffer.isBuffer(chunk)) {
            responseBody += chunk.toString();
          } else if (typeof chunk === 'object') {
            responseBody += JSON.stringify(chunk);
          }
          return true;
        },
      };

      // 在 app 执行前添加日志
      console.log("开始处理请求路径:", url.pathname);

      console.log("正在运行 Express 应用...");

      // 使用 Promise.race 来确保请求不会挂起，调整超时时间
      const timeout = new Promise((_, reject) =>
        setTimeout(() => {
          console.error("请求超时 - Express 应用没有完成处理");
          reject(new Error('Request timeout - Express app did not complete'));
        }, 180000) // 增加到180秒
      ); 
      let routeHandled = false;

      const appExecution = new Promise((resolve, reject) => {
        try {
          // 重新定义响应方法，确保在发送响应后自动完成请求
          ['json', 'send', 'end', 'redirect', 'sendStatus'].forEach(method => {
            const original = expressRes[method];
            expressRes[method] = function (...args) {
              console.log(`调用响应方法: ${method}`, args[0] ? typeof args[0] : "无参数");
              original.apply(this, args);
              expressRes._markAsSent();
              console.log(`响应已标记为发送，状态码: ${statusCode}`);

              // 在响应发送后自动完成请求
              if (!routeHandled) {
                console.log('响应已发送，自动完成请求');
                routeHandled = true;
                resolve(); // 现在可以访问 resolve 函数
              }

              return expressRes;
            };
          });

          // 注入完成回调函数
          const next = (err) => {
            console.log("Express 中间件链执行完成，是否有错误:", err ? "是" : "否");
            routeHandled = true;

            if (err) {
              console.error("Express 应用出错:", err);

              // 如果有错误但没有发送响应，发送错误响应
              if (!isResponseSent) {
                const statusCode = err.status || err.statusCode || 500;
                expressRes.status(statusCode).json({
                  error: err.message || '服务器内部错误',
                  details: process.env.NODE_ENV === 'development' ? err.stack : undefined
                });
              }

              resolve(); // 即使有错误也要解析Promise，让请求完成
              return;
            }

            // 如果还没有发送响应，这里发送默认响应
            if (!isResponseSent) {
              console.log("警告: 路由完成但未发送响应，发送默认响应");
              expressRes.status(404).json({ message: "Not Found - No route handled this request" });
            }

            resolve();
          };

          // 运行 Express 应用
          console.log("调用 Express app...");
          app(expressReq, expressRes, next);

          // 检查是否有立即响应
          if (isResponseSent && !routeHandled) {
            console.log("Express 立即响应，标记为完成");
            routeHandled = true;
            resolve();
          }
        } catch (e) {
          console.error("Express 应用执行出错:", e.stack || e);
          if (!isResponseSent) {
            // 如果发生错误但没有发送响应，发送500错误
            expressRes.status(500).json({
              error: '服务器内部错误',
              message: e.message,
              stack: process.env.NODE_ENV === 'development' ? e.stack : undefined
            });
          }
          routeHandled = true;
          resolve(); // 即使有错误也要解析Promise，让请求完成
        }
      });

      try {
        // 等待应用执行完成或超时
        await Promise.race([appExecution, timeout]);

        console.log(`请求处理完成，状态码: ${statusCode}, 响应体长度: ${responseBody.length}`);

        // 返回 Worker 响应
        return new Response(responseBody, {
          status: statusCode,
          headers: responseHeaders
        });
      } catch (error) {
        console.error("处理请求时出错:", error);
        if (error.message.includes('timeout')) {
          return new Response(JSON.stringify({
            message: '请求处理超时',
            details: '服务器未能在指定时间内完成请求处理'
          }), {
            status: 504,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        throw error; // 重新抛出以便被外层 catch 捕获
      }
    } catch (error) {
      console.error('Worker适配器严重错误:', error);
      return new Response(JSON.stringify({
        message: '服务器内部错误',
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  };

  // 根据文件扩展名获取 Content-Type
  function getContentType(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    const types = {
      'html': 'text/html',
      'css': 'text/css',
      'js': 'application/javascript',
      'json': 'application/json',
      'png': 'image/png',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'gif': 'image/gif',
      'svg': 'image/svg+xml',
      'pdf': 'application/pdf'
    };
    return types[ext] || 'application/octet-stream';
  }
}
