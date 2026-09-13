import React from 'react'

const AboutSpaceFest = () => {
  return (
    <>
      <div className='w-full min-h-screen bg-gradient-to-b from-white to-gray-50 mb-2 pt-32'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          
          <div className='w-full flex flex-col items-center justify-center text-center mb-16'>
           
            <p className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 ">
              About Spacefest
            </p>
            
          </div>

          
          <div className='w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center'>
            <div className='space-y-6 order-2 lg:order-1'>
              <div className='bg-white/50 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20'>
                <p className='text-lg md:text-xl text-gray-700 leading-relaxed'>
                 Space Fest 2026 brought together university space clubs from across Nigeria in a nationwide celebration of research, innovation, and youth participation — part of NIGCOMSAT's 20th Anniversary commemorations. Designed as both a competition and a national capacity-building initiative, Space Fest inspired young Nigerians to actively shape the future of Africa's space industry through original research, bold ideas, and strategic thinking.
                </p>
                
                
                <div className='flex items-center justify-center p-2 gap-4 mt-8'>
                  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbT3VZMJGCU1W-igToBLVaN-2ANsG8dFI7XEGdJA-9tA&s=10" alt="" className='w-full rounded-2xl shadow-lg h-auto' />
                </div>

              </div>
            </div>

            <div className='order-1 lg:order-2'>
              <div className='relative'>
                {/* <div className='absolute -top-4 -left-4 w-full h-full bg-gradient-to-br from-purple-400 to-blue-400 rounded-3xl opacity-20 blur-2xl'></div> */}
                <div className='relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/50'>
                  <img 
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwbQ6nYQ2mTXnl3UGALrW-UPhdm-gt4wVlkU3mfdXOBw&s=10" 
                    className='w-full h-auto object-cover rounded-3xl' 
                    alt="Spacefest" 
                  />
                  
                  
                </div>
              </div>
            </div>
          </div>

          
        </div>
      </div>
    </>
  )
}

export default AboutSpaceFest