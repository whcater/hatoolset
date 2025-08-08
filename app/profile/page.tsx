'use client';

import { UserProfile } from '../../src/components/UserProfile';
import { Header } from '../../src/components/Header';
import { Footer } from '../../src/components/Footer';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="pt-20">
        <UserProfile />
      </main>
      <Footer />
    </div>
  );
}