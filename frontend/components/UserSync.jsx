"use client";
import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function UserSync() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Only run once after user is authenticated
    if (!isLoaded || !isSignedIn || !user) return;

    // Extract user's fullName, firstName, lastName from Clerk properly
    const firstName = user.firstName || "";
    const lastName = user.lastName || "";
    const fullName = user.fullName || (firstName && lastName ? `${firstName} ${lastName}`.trim() : "");

    // For OAuth providers: If fullName is missing, use email prefix as fallback
    const finalFullName = fullName || (user.primaryEmailAddress?.emailAddress?.split("@")[0] || "");

    // Prepare data to send to backend
    const userData = {
      clerkId: user.id,
      firstName: firstName,
      lastName: lastName,
      fullName: finalFullName,
      email: user.primaryEmailAddress?.emailAddress || "",
      profileImage: user.imageUrl || ""
    };

    // POST to backend endpoint (no Authorization header, no token)
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    const endpoint = `${backendUrl}/api/v1/user`;

    fetch(endpoint, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData),
    })
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then(async (data) => {
      if (data.success) {
        console.log('✅ User synced successfully:', data.user);
        
        // Get current pathname
        const currentPath = window.location.pathname;
        
        // Check if user is an astrologer
        const checkAstrologerEndpoint = `${backendUrl}/api/v1/astrologers/check/${user.id}`;
        try {
          const astrologerRes = await fetch(checkAstrologerEndpoint);
          if (astrologerRes.ok) {
            const astrologerData = await astrologerRes.json();
            if (astrologerData.exists) {
              // User is an astrologer, redirect to astrologer dashboard
              // Only redirect if not already on astrologer dashboard
              if (currentPath !== '/astrologer/dashboard') {
                router.push('/astrologer/dashboard');
              }
              return;
            }
          }
        } catch (err) {
          console.log('Not an astrologer or check failed, continuing as regular user');
        }
        
        // Regular user - redirect to home page if coming from login/register
        // Only redirect if we're on login or register pages
        const shouldRedirect = 
          currentPath === '/sign-in' || 
          currentPath === '/login' ||
          currentPath === '/register' ||
          currentPath.startsWith('/login/') ||
          currentPath.startsWith('/register/');
        
        if (shouldRedirect) {
          // Redirect to home page for regular users
          router.push('/');
        }
      } else {
        console.error('❌ User sync failed:', data.message);
      }
    })
    .catch(err => {
      console.error('❌ Sync error:', err);
    });

  }, [isLoaded, isSignedIn, user, router]);

  return null; // This component has no visible UI
}
