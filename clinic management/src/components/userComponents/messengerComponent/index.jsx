//updated code

import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import useFetch from "../../../hooks/useFetch";
import ConversationComponent from "../Conversation";
import MessageContent from "../ChatComponent";
import io from "socket.io-client";

function Messenger() {
  const [conversations, setConversations] = useState([]); // List of all conversations
  const [currentChat, setCurrentChat] = useState(null); // show conversertion when currently click
  const [messages, setMessages] = useState([]); // for seeing the chat conversation
  const [sendMessage, setSendMessage] = useState("");
  const [receiveMessage, setReceiveMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  const[nodata,setNodata]=useState(true)
  const socket = useRef();
  const scrollRef = useRef();

  const user = useSelector((state) => state);
  const userid = user?.user?.id;
  const getRequest = useFetch("GET");
  const postRequest = useFetch("POST");

  //receive- Message
  useEffect(() => {
    socket.current = io("http://localhost:5000");
    // socket.current = io("https://www.wecareindia.online/api");

    socket.current.on("getMessage", (data) => {
      setReceiveMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    receiveMessage &&
      currentChat?.members.includes(receiveMessage.sender) &&
      setMessages((prev) => [...prev, receiveMessage]);
  }, [receiveMessage, currentChat]);

  useEffect(() => {
    socket.current.emit("addUser", userid);
    socket.current.on("getUsers", (users) => {
      setOnlineUsers(users);
    });
  }, [user]);

  console.log(socket);

  //get chat connection list
  useEffect(() => {
    const getConversations = () => {
      try {
        getRequest("/conversations/" + userid).then((res)=>{
          if(res.length === 0)
          {

            setNodata(true)
            console.log(res)
          }
          else
          {
            setNodata(false)

          }
            setConversations(res);
            setLoading(false);
        }).catch((error)=>{
          setNodata(true)
        })

    
      } catch (error) {
        console.log(error);
      }
    };
    getConversations();
  }, [userid]);

  // useEffect(() => {
  //   const getConversations = async () => {
  //     try {
  //       const res = await getRequest("/conversations/" + userid);

  //       setConversations(res);
  //       setLoading(false);
  //     } catch (error) {
  //       // console.log(error);
  //     }
  //   };
  //   getConversations();
  // }, [userid]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        console.log("asdf");
        const res = await getRequest("/messages/" + currentChat?._id);
        setMessages(res);
      } catch (error) {
        console.log(error);
      }
    };
    getMessages();
  }, [currentChat]);


  useEffect(() => {
    console.log("ero rrrrrrrrrrrrd");

    const getUser = async () => {
      try {
        if (currentChat) {
          const doctorId = currentChat?.members?.find((m) => m !== userid);
          const res = await getRequest("/user/doctor/" + doctorId);
          console.log("redoctorr", res);
          // setDoctor(res?.doctor?.[0]);
          setDoctor(res?.doctor?.[0]);

          // setLoading(false)
        }
      } catch (error) {
        console.log("ero d", error);
      }
    };
    getUser();

  }, [currentChat, userid]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (sendMessage.trim() !== "") {
      const message = {
        sender: userid,
        text: sendMessage,
        conversationId: currentChat?._id,
      };

      const receiverId = currentChat.members.find(
        (member) => member !== userid
      );

      socket.current.emit("sendMessage", {
        senderId: userid,
        receiverId,
        text: sendMessage,
      });

      try {
        const res = await postRequest("/messages", message);
        setMessages([...messages, res]);
        setSendMessage("");
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // console.log(messages)

  if (loading) {
    // return <div>Loading...</div>;
    return(
   <div className="min-h-screen flex items-center justify-center">
         <div className="flex justify-start mb-4">
      
    </div>
      <div className="flex items-center">
        <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
    </div>
    )


  }


  return (
    <>{

      nodata?
      <div class="w-full h-screen flex flex-col items-center justify-between">
      <div class="xl:w-1/2 flex-1 flex flex-col items-center justify-center text-center px-4 lg:px-0">
          <svg class="w-3/4" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 945 583.2243" xmlns:xlink="http://www.w3.org/1999/xlink"><path id="b0cf38c7-358d-48dc-a444-e9782686dfa5-94" data-name="Path 438" d="M222.88482,693.5243a24.21463,24.21463,0,0,0,23.38269-4.11877c8.18977-6.87442,10.758-18.196,12.84671-28.68191l6.17972-31.01657-12.93769,8.90836c-9.30465,6.40641-18.81827,13.01866-25.26012,22.29785s-9.25222,21.94708-4.07792,31.988" transform="translate(-127.5 -158.38785)" fill="#e6e6e6"></path><path id="acbbaa8b-0bc2-4bc9-96d7-93dd88f90f19-95" data-name="Path 439" d="M224.88254,733.23486c-1.6284-11.86369-3.30382-23.88079-2.15885-35.87167,1.01467-10.64933,4.26374-21.04881,10.87831-29.57938a49.20592,49.20592,0,0,1,12.62466-11.44039c1.26216-.79648,2.4241,1.20354,1.16733,1.997A46.77938,46.77938,0,0,0,228.88954,680.666c-4.02858,10.24607-4.67546,21.41582-3.98154,32.30029.41943,6.58218,1.31074,13.12121,2.20587,19.65252a1.19817,1.19817,0,0,1-.808,1.4225,1.16348,1.16348,0,0,1-1.42253-.808Z" transform="translate(-127.5 -158.38785)" fill="#f2f2f2"></path><path id="bed63620-84ae-4c66-a7c8-0d9b30f8c1e7-96" data-name="Path 442" d="M236.60356,714.19841A17.82515,17.82515,0,0,0,252.135,722.217c7.8644-.37318,14.41806-5.85972,20.31713-11.07026l17.452-15.40881-11.54988-.5528c-8.30619-.39784-16.82672-.771-24.73813,1.79338s-15.20758,8.72639-16.654,16.9154" transform="translate(-127.5 -158.38785)" fill="#e6e6e6"></path><path id="fc4eb8ca-daad-4589-b224-2c71eec1c546-97" data-name="Path 443" d="M220.27955,740.05454c7.83972-13.87142,16.93235-29.28794,33.1808-34.21551A37.02589,37.02589,0,0,1,267.4158,704.398c1.4819.128,1.1118,2.41174-.367,2.28454a34.39824,34.39824,0,0,0-22.27164,5.89215c-6.27994,4.27453-11.16975,10.21755-15.30781,16.51907-2.5351,3.8605-4.80576,7.88445-7.07642,11.903C221.66738,742.28125,219.54555,741.35371,220.27955,740.05454Z" transform="translate(-127.5 -158.38785)" fill="#f2f2f2"></path><path id="ec83fa9a-7bb4-4b90-a90b-e1cec4444963-98" data-name="Path 442" d="M1008.35714,710.03894a17.82515,17.82515,0,0,1-17.065,3.78282c-7.50783-2.37076-12.4416-9.35006-16.813-15.89522l-12.93426-19.3574,11.30757,2.41744c8.132,1.73826,16.46493,3.55513,23.45819,8.05635s12.47224,12.32329,11.77771,20.61" transform="translate(-127.5 -158.38785)" fill="#e6e6e6"></path><path id="e32935a9-e392-46b4-9a67-68c65f1cc9fa-99" data-name="Path 443" d="M1017.53074,739.20841c-4.03412-15.41439-8.88464-32.64277-23.33408-41.55944a37.026,37.026,0,0,0-13.12367-4.9599c-1.46539-.255-1.69126,2.04749-.22905,2.30247a34.39822,34.39822,0,0,1,20.02606,11.3886c4.9789,5.73758,8.18741,12.733,10.57751,19.88279,1.46425,4.38021,2.63106,8.85084,3.79926,13.31624C1015.61991,741.00647,1017.90833,740.652,1017.53074,739.20841Z" transform="translate(-127.5 -158.38785)" fill="#f2f2f2"></path><path d="M858.65906,513.48057H594.33494a7.97081,7.97081,0,0,1-7.96157-7.96157V416.34942a7.97081,7.97081,0,0,1,7.96157-7.96157H858.65906a7.9707,7.9707,0,0,1,7.96157,7.96157V505.519A7.9707,7.9707,0,0,1,858.65906,513.48057Z" transform="translate(-127.5 -158.38785)" fill="#f1f1f1"></path><rect x="500.27353" y="273.88471" width="70.06181" height="7.96157" fill="#18185a"></rect><circle cx="662.68956" cy="278.66165" r="4.77694" fill="#18185a"></circle><circle cx="678.6127" cy="278.66165" r="4.77694" fill="#18185a"></circle><circle cx="694.53583" cy="278.66165" r="4.77694" fill="#18185a"></circle><path d="M858.65906,626.53486H594.33494a7.97081,7.97081,0,0,1-7.96157-7.96157V529.40371a7.97081,7.97081,0,0,1,7.96157-7.96157H858.65906a7.9707,7.9707,0,0,1,7.96157,7.96157v89.16958A7.9707,7.9707,0,0,1,858.65906,626.53486Z" transform="translate(-127.5 -158.38785)" fill="#f1f1f1"></path><rect x="500.27353" y="386.939" width="70.06181" height="7.96157" fill="#18185a"></rect><circle cx="662.68956" cy="391.71594" r="4.77694" fill="#18185a"></circle><circle cx="678.6127" cy="391.71594" r="4.77694" fill="#18185a"></circle><circle cx="694.53583" cy="391.71594" r="4.77694" fill="#18185a"></circle><path d="M858.65906,739.58915H594.33494a7.97081,7.97081,0,0,1-7.96157-7.96156V642.458a7.97081,7.97081,0,0,1,7.96157-7.96157H858.65906a7.9707,7.9707,0,0,1,7.96157,7.96157v89.16959A7.97069,7.97069,0,0,1,858.65906,739.58915Z" transform="translate(-127.5 -158.38785)" fill="#f1f1f1"></path><rect x="500.27353" y="499.99329" width="70.06181" height="7.96157" fill="#18185a"></rect><circle cx="662.68956" cy="504.77024" r="4.77694" fill="#18185a"></circle><circle cx="678.6127" cy="504.77024" r="4.77694" fill="#18185a"></circle><circle cx="694.53583" cy="504.77024" r="4.77694" fill="#18185a"></circle><path d="M759.01179,321.31453l-.29232-.216-.007-.00528a3.57626,3.57626,0,0,0-5.00334.73888L694.21319,401.9379h-6.54562v-1.53783a1.43056,1.43056,0,0,0-1.43052-1.43052h-3.90531a1.43056,1.43056,0,0,0-1.43052,1.43052v1.53783h-2.26034v-1.53783a1.43056,1.43056,0,0,0-1.43052-1.43052h-3.9053a1.43057,1.43057,0,0,0-1.43053,1.43052v1.53783h-2.253v-1.53783a1.43057,1.43057,0,0,0-1.43053-1.43052h-3.9053a1.43056,1.43056,0,0,0-1.43052,1.43052v1.53783h-2.26034v-1.53783a1.43056,1.43056,0,0,0-1.43052-1.43052H655.259a1.43057,1.43057,0,0,0-1.43053,1.43052v1.53783h-2.253v-1.53783a1.43057,1.43057,0,0,0-1.43053-1.43052h-3.9053a1.43034,1.43034,0,0,0-1.43052,1.43052v1.53783H642.5488v-1.53783a1.43056,1.43056,0,0,0-1.43052-1.43052H637.213a1.43057,1.43057,0,0,0-1.43053,1.43052v1.53783h-2.26034v-1.53783a1.43056,1.43056,0,0,0-1.43052-1.43052h-3.9053a1.43057,1.43057,0,0,0-1.43053,1.43052v1.53783h-2.253v-1.53783a1.43056,1.43056,0,0,0-1.43052-1.43052h-3.9053a1.43057,1.43057,0,0,0-1.43053,1.43052v1.53783h-2.26034v-1.53783a1.43056,1.43056,0,0,0-1.43052-1.43052h-3.9053a1.43057,1.43057,0,0,0-1.43053,1.43052v1.53783h-2.253v-1.53783a1.43056,1.43056,0,0,0-1.43052-1.43052h-3.90531a1.43056,1.43056,0,0,0-1.43052,1.43052v1.53783H596.858a3.57618,3.57618,0,0,0-3.57631,3.57631V408.926a3.57618,3.57618,0,0,0,3.57631,3.57631h96.76151a5.32944,5.32944,0,0,0,5.21778-4.24744l.037.02751L759.74521,326.325l.00559-.00707A3.57671,3.57671,0,0,0,759.01179,321.31453Z" transform="translate(-127.5 -158.38785)" fill="#3f3d56"></path><polygon points="255.504 550.825 267.523 556.976 296.966 513.544 279.228 504.466 255.504 550.825" fill="#ffb7b7"></polygon><path d="M381.94612,703.72021l23.66983,12.113.001.00049a16.94563,16.94563,0,0,1,7.3641,22.8037l-.25087.49017-38.75427-19.83265Z" transform="translate(-127.5 -158.38785)" fill="#2f2e41"></path><polygon points="394.317 567.652 407.819 567.652 414.242 515.575 394.315 515.575 394.317 567.652" fill="#ffb7b7"></polygon><path d="M518.37323,721.632l26.58922-.00107h.00107a16.94563,16.94563,0,0,1,16.94473,16.94446v.55063l-43.53421.00162Z" transform="translate(-127.5 -158.38785)" fill="#2f2e41"></path><path d="M458.66285,301.26058s-9.0412-6.9268-9.0412,9.99291l-1.42756,55.91271,15.94107,52.81966,9.27913-17.1307-3.80682-37.11652Z" transform="translate(-127.5 -158.38785)" fill="#2f2e41"></path><path d="M555.37734,454.19165s10.48418,51.058-2.79579,92.95976l-7.33892,161.10695-26.90941-2.09684-9.43576-119.51969-9.0863-59.41037-18.87153,54.16828L418.73348,696.02681l-28.65677-22.36625s31.75629-86.64916,55.2167-104.84184l11.76615-134.011Z" transform="translate(-127.5 -158.38785)" fill="#2f2e41"></path><circle cx="523.48018" cy="202.31369" r="30.68251" transform="translate(-32.63308 406.2144) rotate(-61.33685)" fill="#ffb7b7"></circle><path d="M521.30883,208.82157c3.67807.47856,6.45254-3.28467,7.73937-6.76336s2.2673-7.5286,5.46514-9.40772c4.36891-2.56725,9.95872.52048,14.95479-.32655,5.64211-.95654,9.31053-6.93607,9.598-12.65146s-1.987-11.21239-4.21862-16.48193l-.77911,6.54884a12.98679,12.98679,0,0,0-5.67512-11.35154l1.00419,9.60941A10.199,10.199,0,0,0,537.6641,159.558l.15814,5.72564c-6.51663-.77489-13.09021-1.55087-19.62615-.96052s-13.11751,2.65828-18.0712,6.96269c-7.40994,6.43874-10.11621,17.04088-9.20765,26.81529s4.94341,18.95675,9.14865,27.827c1.058,2.23177,2.52146,4.75016,4.97491,5.03445,2.20445.25544,4.22155-1.58732,4.90683-3.698a13.40422,13.40422,0,0,0-.0595-6.58474c-.62-3.2946-1.40155-6.6621-.81863-9.96346s2.9579-6.56372,6.28582-6.96831,6.73322,3.3994,5.13321,6.34537Z" transform="translate(-127.5 -158.38785)" fill="#2f2e41"></path><polygon points="429.776 309.458 327.357 302.85 335.066 270.913 428.674 291.838 429.776 309.458" fill="#cbcbcb"></polygon><path d="M494.11389,244.15824l6.424-8.91878s7.18028,2.44014,26.40983,12.01183l1.35857,8.35615L561.685,460.9092,501.01375,458.292l-16.5219-.35153-5.4068-12.12-6.66725,11.86313-16.13421-.34328-16.41693-9.51706,16.179-49.48869,5.23438-45.206-8.0895-42.58883s-10.17937-39.10848,29.027-60.19538Z" transform="translate(-127.5 -158.38785)" fill="#2f2e41"></path><path d="M630.86271,399.57305a10.48605,10.48605,0,0,1-13.04108-9.40577L581.82654,380.526l14.48005-12.85707,31.9616,11.12669a10.54289,10.54289,0,0,1,2.59452,20.77747Z" transform="translate(-127.5 -158.38785)" fill="#ffb7b7"></path><path d="M614.74112,394.13009a6.14221,6.14221,0,0,1-4.987.39563l-59.21317-22.47383a63.2273,63.2273,0,0,1-34.03214-28.68449l-24.6929-44.04893a19.76509,19.76509,0,1,1,29.49118-26.323L564.04672,340.737l53.7869,31.53448a6.15547,6.15547,0,0,1,2.61747,6.54608l-2.67464,11.33426a6.1431,6.1431,0,0,1-1.86626,3.15032A6.07364,6.07364,0,0,1,614.74112,394.13009Z" transform="translate(-127.5 -158.38785)" fill="#2f2e41"></path><path d="M1071.5,741.38785h-943a1,1,0,0,1,0-2h943a1,1,0,0,1,0,2Z" transform="translate(-127.5 -158.38785)" fill="#cbcbcb"></path></svg>
          <p class="text-4xl font-bold text-gray-700 capitalize tracking-wide mt-8">No Chat Conversation Found!</p>
          <p class="text-xl text-gray-700 uppercase mt-4">Take the Appointment for Consulting.</p>
      </div>
      <div class="w-full py-4 border-t border-gray-300">
          <div class="container mx-auto flex flex-col md:flex-row items-center justify-center text-gray-600 text-sm md:space-x-8 space-y-1 md:space-y-0">
              <span class="font-bold">You can contact us:</span>
              <a href="#" class="flex items-center space-x-1" target="_blank" title="Call">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                  </svg>
                  <span>+1 123-123-1234</span>
              </a>
              <a href="#" class="flex items-center space-x-1" target="_blank" title="Email">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                  </svg>
                  <span>contact@example.com</span>
              </a>
          </div>
          
      </div>
   </div>
    :
    <>
  

<div>
      <div className="container mx-auto shadow-lg rounded-lg">
        {currentChat === null && (
          <div className="px-5 py-5 flex justify-between items-center bg-white border-b-2">
            <div className="font-semibold text-2xl">Main</div>
            <div className="h-12 w-12 p-2 bg-yellow-500 rounded-full text-white font-semibold flex items-center justify-center">
              RA
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row">
          {/* Chat list */}
          {currentChat ? // Hide the conversation list when currentChat is truthy
          null : (
            <div className="flex flex-col w-full md:w-2/5 md:border-r-2 overflow-y-auto">
              {conversations.map((c) => (
                <div key={c.id} onClick={() => setCurrentChat(c)}>
                  <ConversationComponent
                    conversation={c}
                    currentUser={userid}
                  />
                </div>
              ))}
            </div>
          )}

          <div className="w-full md:w-5/5">
            {" "}
            {/* Adjust the width */}
            {currentChat ? (
              <>
                <div className="flex-grow p-5 overflow-y-auto">
                  <div className="px-5 py-5 flex justify-between items-center bg-white border-b-2">
                    <div className="flex items-center">
                      {" "}
                      {/* Add flex and items-center to center the content */}
                      <img
                        src={doctor?.image}
                        alt="Doctor"
                        className="h-8 w-8 rounded-full ml-2"
                      />
                      <div className="font-semibold text-2xl ml-4">
                        Dr.{doctor?.firstName} {doctor?.lastName}
                      </div>
                    </div>
                    <div className="h-12 w-12 p-2 bg-yellow-500 rounded-full text-white font-semibold flex items-center justify-center">
                      RA
                    </div>
                  </div>

                  {messages.map((m) => (
                    <div key={m.id} ref={scrollRef}>
                      <MessageContent
                        chat={currentChat}
                        messages={m}
                        own={m.sender === userid}
                      />
                    </div>
                  ))}
                </div>

                <div className="py-5 px-3">
                  <div className="relative">
                    <input
                      className="w-full bg-gray-300 py-5 px-3 rounded-xl"
                      type="text"
                      placeholder="Type your message here..."
                      onChange={(e) => setSendMessage(e.target.value)}
                      value={sendMessage}
                    />
                    <button
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-500 text-white py-2 px-4 rounded-md"
                      onClick={handleSubmit}
                      disabled={sendMessage.trim() === ""}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* <div className="flex-grow p-5 flex items-center justify-center">
              <span className="text-5xl text-gray-200 text-center">Open a conversation</span>
            </div> */}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  }
 
    </>
   
  );
}

export default Messenger;