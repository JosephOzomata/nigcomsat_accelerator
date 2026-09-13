import React from 'react';

function EligibilityChecklist() {
  const checklistItems = [
    { id: 1, text: "01. Legally registered with the CAC" },
    { id: 2, text: "02. Have a working MVP or prototype" },
    { id: 3, text: "03. Team of 2-4 members with relevant expertise" },
    { id: 4, text: "04. Strong growth potential and scalability" },
    { id: 5, text: "05. Active website or digital presence" },
    { id: 6, text: "06. Can commit to the full program schedule" },
    { id: 7, text: "07. Ready to submit a 1-minute product demo video" },
  ];

  return (
    <div className="w-full min-h-[250px] bg-[#fcfcdc] flex flex-col items-center justify-start p-6 md:p-12 box-border">
      

      <header className="text-center mb-12">
        <h2 className="text-2xl font-black text-black">Eligibility Checklist</h2>
      </header>

      <div className="relative max-w-2xl w-full flex flex-col items-center pb-24">
        
        <div className="absolute left-1/2 top-0 bottom-[260px] w-1 bg-black -translate-x-1/2 z-0 w-[2px]"
        style={{backgroundImage: 'linear-gradient(to bottom, black 45%, rgba(255,255,255,0) 35%)',
            backgroundSize: '2px 8px',
            backgroundRepeat: 'repeat-y',
            backgroundColor: 'transparent'}}></div>
        
        <div className="w-full flex flex-col gap-12 mb-20">
          
          <div className="flex w-full z-10">
            <div className="w-1/2 flex justify-end pr-8">
              <div className="w-[350px] h-[150px] bg-white rounded-xl flex items-center justify-center p-4 shadow-md hover:shadow-lg transition-shadow duration-300 text-left">
                <p className="text-md font-bold text-slate-800 font-sans leading-snug text-center">{checklistItems[0].text}</p>
              </div>
            </div>
            <div className="w-1/2 flex justify-start pl-8">
              <div className="w-[350px] h-[150px] bg-white rounded-xl flex items-center justify-center p-4 shadow-md hover:shadow-lg transition-shadow duration-300 text-left">
                <p className="text-md font-bold text-slate-800 font-sans leading-snug text-center">{checklistItems[1].text}</p>
              </div>
            </div>
          </div>

          <div className="flex w-full z-10">
            <div className="w-1/2 flex justify-end pr-8">
              <div className="w-[350px] h-[150px] bg-white rounded-xl flex items-center justify-center p-4 shadow-md hover:shadow-lg transition-shadow duration-300 text-left">
                <p className="text-md font-bold text-slate-800 font-sans leading-snug text-center">{checklistItems[2].text}</p>
              </div>
            </div>
            <div className="w-1/2 flex justify-start pl-8">
              <div className="w-[350px] h-[150px] bg-white rounded-xl flex items-center justify-center p-4 shadow-md hover:shadow-lg transition-shadow duration-300 text-left">
                <p className="text-md font-bold text-slate-800 font-sans leading-snug text-center">{checklistItems[3].text}</p>
              </div>
            </div>
          </div>

          <div className="flex w-full z-10">
            <div className="w-1/2 flex justify-end pr-8">
              <div className="w-[350px] h-[150px] bg-white rounded-xl flex items-center justify-center p-4 shadow-md hover:shadow-lg transition-shadow duration-300 text-left">
                <p className="text-md font-bold text-slate-800 font-sans leading-snug text-center">{checklistItems[4].text}</p>
              </div>
            </div>
            <div className="w-1/2 flex justify-start pl-8">
              <div className="w-[350px] h-[150px] bg-white rounded-xl flex items-center justify-center p-4 shadow-md hover:shadow-lg transition-shadow duration-300 text-left">
                <p className="text-md font-bold text-slate-800 font-sans leading-snug text-center">{checklistItems[5].text}</p>
              </div>
            </div>
          </div>

        </div>

        <div className="z-10 flex justify-center w-full">
          <div className="w-[350px] h-[150px] bg-white rounded-xl flex items-center justify-center p-4 shadow-md hover:shadow-lg transition-shadow duration-300 text-left">
            <p className="text-md font-bold text-slate-800 font-sans leading-snug text-center">
              {checklistItems[6].text}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default EligibilityChecklist