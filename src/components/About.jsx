import React from 'react';

function About() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white p-10 rounded-lg shadow-lg border-2 border-gray-300 space-y-8">
        <h1 className="text-4xl font-bold text-gray-800 text-center">About Prescription Scheduler</h1>
        <p className="text-lg text-gray-600 text-center">
          Prescription Scheduler is your go-to tool for managing medications with ease. Upload a prescription image or enter details manually, and we’ll extract the info, schedule your doses, and keep you on track.
        </p>
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Features</h2>
          <ul className="list-disc list-inside text-lg text-gray-600 space-y-3">
            <li>Upload prescription images to extract medication details automatically.</li>
            <li>Manually input medications for personalized scheduling.</li>
            <li>Get scheduled notifications so you never miss a dose.</li>
            <li>Secure login with email verification for your peace of mind.</li>
          </ul>
        </div>
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">How It Works</h2>
          <p className="text-lg text-gray-600">
            Sign up, verify your email, then either upload a prescription or add your meds manually. We process the data and set up a schedule tailored to your needs. It’s that simple!
          </p>
        </div>
        <div className="text-center">
          <a href="/" className="text-lg text-blue-600 hover:underline font-semibold">
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}

export default About;