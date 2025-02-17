import React, { useState } from 'react'
import toast,{Toaster} from 'react-hot-toast'
import { useNavigate } from 'react-router-dom';
import useFetch from '../../../hooks/useFetch';





function EmailComponent() {

  const history=useNavigate();
  const [email,setEmail]=useState("")
  const [emailErr,setEmailErr]=useState("")
  const [showModal, setShowModal] = useState(false);
  const postRequest=useFetch('POST')
  const navigate=useNavigate()

function handleOnchange(e) {
  setEmail((prev)=>{
    return {
      ...prev,
      [e.target.name]:e.target.value
    }
  })
}

function handleSubmit(e) {

  e.preventDefault();

  if ( email == "" ) {

    setEmailErr(prev => ({ ...prev, email: "Please provide an email address" }));
    return;
  }
  // if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
  //   setEmailErr(prev => ({ ...prev, email: "Invalid email address" }));
  //   return;
  // }
 
  try{
    postRequest('/user/forgot-password',email).then(res=>{ 
      console.log("sssssssssssssssssssssssssss",res)
      setShowModal(true);


      return res;
    }).catch((error)=>{
      console.log(error)
    })
  }catch(error){
    history('/sign')
    console.log(error)
  }

  
}






  return (
<>
  <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img class="mx-auto h-10 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" />
      <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Enter Your Registered Email</h2>
    </div>
  
    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" action="#" method="POST">
        <div>
          <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email address</label>
          <div class="mt-2">
            <input id="email" name="email"onChange={handleOnchange} type="email" autocomplete="email" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
          </div>
          {emailErr && <p className="text-red-500 text-sm mt-1">{emailErr.email}</p>}
        </div>
  
        <div>
          
      
        </div>
  
        <div>
          <button type="submit" onClick={handleSubmit} class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign in</button>
        </div>
      </form>
  
      
    </div>
  </div>
  
  {showModal && (
    <div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
 
  <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

  <div class="fixed inset-0 z-10 overflow-y-auto">
    <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
     
      <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
        <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            {/* <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div> */}
            <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
              <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">Recover the account</h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">Check your Registered email account and Click the link for further Procedure.</p>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
          <button type="button"onClick={()=>{
            navigate('/login')
          }} class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto">Ok</button>
          {/* <button type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel</button> */}
        </div>
      </div>
    </div>
  </div>
</div>

  )}
</>


  )
}

export default EmailComponent
