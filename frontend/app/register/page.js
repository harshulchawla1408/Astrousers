import { SignUp } from "@clerk/nextjs";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left Column - Background Image */}
      <div className="flex-1 relative hidden lg:block">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/signup.jpg')"
          }}
        />
        <div className="absolute inset-0 bg-black/40" />
        
        {/* Overlay content */}
        <div className="absolute inset-0 flex flex-col justify-center items-center p-12 text-white">
          <div className="text-center max-w-md">
            <h1 className="text-4xl font-bold mb-6">Join Astrousers</h1>
            <p className="text-lg mb-8 opacity-90">
              Discover your cosmic destiny and unlock the secrets of the stars with us.
            </p>
            
            {/* Rectangular astrology illustration */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">🔮</span>
                </div>
                <div className="flex justify-center space-x-3 mb-4">
                  <span className="text-xl">✨</span>
                  <span className="text-xl">✨</span>
                </div>
                <div className="flex justify-center space-x-2 mb-4">
                  <span className="text-lg">🌟</span>
                  <span className="text-lg">🌠</span>
                  <span className="text-lg">💫</span>
                </div>
                <div className="text-sm opacity-80">Cosmic Journey</div>
              </div>
            </div>
            
            {/* Features card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 mt-6">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white text-sm font-bold">★</span>
                </div>
                <span className="font-semibold">Premium Astrology Features</span>
                <span className="ml-auto text-gray-300">→</span>
              </div>
              <p className="text-sm opacity-80">
                Get personalized horoscopes, birth chart analysis, and cosmic insights daily.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Column - Signup Form */}
      <div className="flex-1 flex justify-center items-center p-8 bg-gradient-to-br from-gray-900 to-black">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-2">Create Your account</h2>
          <p className="text-gray-300 mb-8">
            Already have an account?{" "}
            <a href="/login" className="text-purple-400 hover:text-purple-300 font-medium">
              Sign In
            </a>
          </p>
          
          <SignUp
            appearance={{
              elements: {
                formButtonPrimary: "bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-lg transition-colors duration-200 w-full",
                formFieldInput: "bg-gray-800 border border-gray-600 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200",
                formFieldLabel: "text-gray-300 font-medium mb-2",
                formFieldInputShowPasswordButton: "text-gray-400 hover:text-gray-200",
                footerActionLink: "text-purple-400 hover:text-purple-300 font-medium",
                formFieldRow: "mb-4",
                formField: "mb-4",
                formHeaderTitle: "hidden",
                formHeaderSubtitle: "hidden",
                socialButtonsBlockButton: "bg-gray-800 border border-gray-600 text-white rounded-lg px-4 py-3 hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center space-x-2",
                socialButtonsBlockButtonText: "text-gray-200 font-medium",
                dividerLine: "bg-gray-600",
                dividerText: "text-gray-400 text-sm",
                identityPreviewText: "text-gray-300",
                identityPreviewEditButton: "text-purple-400 hover:text-purple-300",
              },
            }}
            path="/register"
            routing="path"
            signInUrl="/login"
          />
        </div>
      </div>
    </div>
  );
}
