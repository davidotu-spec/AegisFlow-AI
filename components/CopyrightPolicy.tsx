import React from 'react';

const CopyrightPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in slide-in-from-bottom-4 duration-500">
      <header className="text-center space-y-4">
        <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-[0.2em]">
          Legal
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">Copyright Policy</h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
          Last Updated: March 10, 2026
        </p>
      </header>

      <div className="bg-slate-900/40 border border-slate-800 p-8 md:p-12 rounded-[2.5rem] shadow-2xl space-y-8 text-slate-300 leading-relaxed">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">1. Ownership of Content</h2>
          <p>
            All content, features, and functionality on the Mixxd FinOps AI platform, including but not limited to text, graphics, logos, icons, images, audio clips, video clips, data compilations, software, and the design, selection, and arrangement thereof (collectively, the "Content"), are the exclusive property of Mixxd or its licensors and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">2. Limited License</h2>
          <p>
            Mixxd grants you a personal, non-exclusive, non-transferable, revocable license to access and use the platform strictly for your internal business purposes. You may not:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the Content.</li>
            <li>Use any illustrations, photographs, video or audio sequences, or any graphics separately from the accompanying text.</li>
            <li>Delete or alter any copyright, trademark, or other proprietary rights notices from copies of materials from this site.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">3. User Contributions</h2>
          <p>
            By providing any content or data to the platform, you grant Mixxd a non-exclusive, worldwide, royalty-free, sublicensable, and transferable license to use, reproduce, distribute, prepare derivative works of, and display that content in connection with the platform's services. You represent and warrant that you own or control all rights in and to your contributions and have the right to grant the license granted above.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">4. Digital Millennium Copyright Act (DMCA)</h2>
          <p>
            Mixxd respects the intellectual property rights of others. If you believe that any Content on our platform infringes upon your copyright, please notify our designated Copyright Agent at:
          </p>
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
            <p className="font-bold text-white">Copyright Agent</p>
            <p>Mixxd Legal Department</p>
            <p>Email: legal@mixxd.org</p>
            <p className="mt-2 pt-2 border-t border-slate-700/50 text-xs">
              General Inquiries: <a href="mailto:info@mixxd.org" className="text-indigo-400 hover:text-indigo-300">info@mixxd.org</a>
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">5. Termination</h2>
          <p>
            We reserve the right to terminate the accounts of users who are repeat infringers or who repeatedly violate this Copyright Policy.
          </p>
        </section>

        <div className="pt-8 border-t border-slate-800 text-center">
          <p className="text-sm text-slate-500">
            &copy; 2026 Mixxd. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CopyrightPolicy;
