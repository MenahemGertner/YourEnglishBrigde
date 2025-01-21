import { Cat } from 'lucide-react';

const ProgressProcess = () => {
    return(
        <div className='fixed bottom-4 left-4 z-50'>
        <div className="animate-bounce">
              <Cat 
                className="h-14 w-14 transition-colors duration-200 text-blue-900 hover:text-blue-700"
              />
            </div>
            </div>
    )
}

export default ProgressProcess;