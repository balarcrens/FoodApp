import React from 'react'
import { Toaster } from 'react-hot-toast';

export default function Alert() {
    return (
        <div className='z-999'>
            <Toaster position="top-right" reverseOrder={false} />
        </div>
    )
}
