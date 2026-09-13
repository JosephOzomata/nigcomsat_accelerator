export default function Checklist() {
       const DataItems = [
           'Are you legally registered with the CAC',
             'Do you have any MVP or Prototype',
            'A team of 2-4 with relevant experience',
          'Does your team have any strong potential and visible scalabity',
           'Any active Website or visible digital presence',
           ' Can you you commit to the full program structure',
            'Submit a 1 minute demo video',
       ];

       return (
              <div className=" md:col-span-1 md:sticky md:top-24 md:self-start bg-transparent rounded-mg flex flex-col p-8 min-h-[250px] mx-auto">
                     {/* header title */}
                     <div className="mb-4 w-full flex items-center justify-between">
                            <h3 className="md-4 text-xl font-bold uppercase tracking-wide text-black">
                                   Eligibilty Checklist
                            </h3>
                     </div>
                    {/*The Data and vertical line of the stepper*/}
                    <ul className="grid grid-flow-col grid-rows-4 gap-x-4 gap-y-3">
                     
                     {DataItems.map ((item, index) => (
                            <li 
                            key={index}
                            className={`flex items-center gap-2.5 rounded-lg border border-white bg-black/30 p-3 ${
                                   index === 3 ? "col-span-2 justify-self-center" : ""
                            }`}>
                                   <span className="text-[13.5px] leading-tight text-white">{item}</span>
                            </li>
                     ))}
                </ul>
              </div>
       

)

}