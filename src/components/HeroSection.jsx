import heroImage from "../images/hero.png";

function HeroSection (){
   return(
      <section className="bg-white pt-10 min-h-screen">
         <div className="max-w-7xl mx-auto px-8 py-20">
            <div className="grid lg:grid-cols-2 sm:grid-cols-1 gap-12 items-center">
               
               <div>

                 
                  <div className="flex items-center gap-3 mb-8">
                     <div className="w-12 h-[2px] bg-gray-500"></div>

                     <p className="uppercase tracking -[0.25em] text-gray-500 text-sm font-semibold">
                        20th Anniversary • 2026
                     </p>
                  </div>
                 
                 <h1 className="text-7xl font-bold text-black leading-none mb-6">
                     SpaceFest
                     <br />
                     2026
                 </h1>

                  
                  <p className="text-xl text-gray-600 leading-9 mb-8">
                     Nigeria's premier university space research showcase,
                     bringing together the next generation of space scientists,
                     engineers, policy leaders and innovators.
                  </p>
                
               </div>
              
               <div>
                  <img
                     src={heroImage}
                     alt="Space Illustration"
                     className="w-full rounded-2xl"
                  />
               </div>

            </div>

            <div className="grid lg:grid-cols-4 sm:grid-cols-2 gap-6 mt-20">

               {/* Card 1 */}
               <div className="bg-black rounded-2xl p-6 shadow">
                  <h2 className="text-4xl text-white font-bold">1728</h2>
                  <p className="text-white">Public Votes</p>
               </div>

               {/* Card 2 */}
               <div className="bg-black rounded-2xl p-6 shadow">
                  <h2 className="text-4xl text-white font-bold">2</h2>
                  <p className="text-white">Research Tracks</p>
               </div>

               {/* Card 3 */}
               <div className="bg-black rounded-2xl p-6 shadow">
                  <h2 className="text-4xl text-white font-bold">3</h2>
                  <p className="text-white">Finalists</p>
               </div>

               {/* Card 4 */}
               <div className="bg-black rounded-2xl p-6 shadow">
                  <h2 className="text-4xl text-white font-bold">20</h2>
                  <p className="text-white">Years of Impact</p>
               </div>

            </div>

         </div>

      </section>
   );
}

export default HeroSection