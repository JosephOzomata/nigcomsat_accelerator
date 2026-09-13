import spotlight from '../images/Spotlight.png'

export default function Spotlight() {
 
  const content ={
      title: "AstroHub Space Club",
      tagline: "The Winning research",
      desc: "The project stood out for its strong policy-focused approach, originality, and relevance to Nigeria’s evolving space sector — with a compelling emphasis on creating a more inclusive, investment-friendly regulatory environment for the national space economy.",
  
  };

  return (
    <div
    style={{
      minHeight: '100vh',
      backgroundColor:'white',
      color:'white',
      display:'flex',
    }}
    >      

      <div style={{ width: '50%', padding: '6rem 4rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: '480px', margin: '0 auto' }}>
          
          <span style={{ fontSize: '2.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'black', display: 'block', marginBottom: '0.75rem' }}>
            {content.tagline}
          </span>

          <h1 style={{ fontSize: '2.05rem', fontWeight: 800, margin: '0 0 1.25rem 0', color: '#111827', letterSpacing: '-0.025em', transition: 'opacity 0.3s ease' }}>
            {content.title}
          </h1>

          <p style={{ fontSize: '1.125rem', color: '#4b5563', lineHeight: '1.75', margin: '0 0 2.5rem 0' }}>
            {content.desc}
          </p>

        </div>
      </div>

      <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '-12rem', position: 'relative', zIndex: 10 }}>
        
       
        
          <div style={{width:'150', display:'flex', alignItems:'center', justifyContent:'center', padding:'-12rem'}}>
            < div style={{
              width: '100%',
              maxWidth: '1000px',
              height: '400px',
              borderRadius: '24px',
              overflow: 'medium',
              background: '#f5f5dc',
              boxShadow: '0 20px 40px -15px rgba(o,o,o,o.1)'

            }}
              >
                
        <img
        src={spotlight }
        alt={content.title}
        className='w-full rounded-3xl'
        />
        
            
            </div>
          

        </div>
        
      </div>

  </div>
  );
}
