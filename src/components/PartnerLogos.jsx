const PartnerLogos = () => {
    return (
      <footer className='container mx-auto px-4 py-16 border-t'>
        <div className='grid grid-cols-2 md:grid-cols-5 gap-8 items-center opacity-50'>
          <img src='/yahoo-finance.svg' alt='Yahoo Finance' className='h-6' />
          <img src='/medium.svg' alt='Medium' className='h-6' />
          <img src='/newsfile.svg' alt='Newsfile' className='h-6' />
          <img src='/vntr.svg' alt='VNTR' className='h-6' />
          <img src='/eu-startups.svg' alt='EU Startups' className='h-6' />
        </div>
      </footer>
    );
  };
  
  export default PartnerLogos;