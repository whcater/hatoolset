'use client';

import { ToolSubmission } from '../../src/components/ToolSubmission';
import { Header } from '../../src/components/Header';
import { Footer } from '../../src/components/Footer';

export default function SubmitPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="pt-20">
        <ToolSubmission />
      </main>
      <Footer />
    </div>
  );
}