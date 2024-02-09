import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import styles from './dropbox.module.css'
import axios from 'axios';
import { AppContext } from '../Context/Context';
import { jokesArray } from './jokesarray'



export function Dropbox() {
  const [isUploadComplete, setUploadComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const  {fileHash, setFileHash, setRetryAttempt}  = useContext(AppContext);
  const messages = jokesArray;

  const [currentMessage, setCurrentMessage] = useState('');
  const [messageIndex, setMessageIndex] = useState(Math.floor(Math.random() * messages.length));
  const [displayedMessage, setDisplayedMessage] = useState('');
  const [uploadError, setUploadError] = useState('');

  
  const navigate = useNavigate()

  const drop = React.useRef(null);
  const fileInput = React.useRef(null);

  useEffect(() => {
    if (isLoading) {
      console.log("interval set");
      const intervalId = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * messages.length);
        setMessageIndex(randomIndex);
      }, 10000);
      console.log("Interval cleared");
      return () => clearInterval(intervalId);
    }
  }, [messages.length, isLoading]);

  useEffect(() => {
    if (isLoading) {
      setCurrentMessage(messages[messageIndex]);
    }
  }, [messageIndex, messages, isLoading]);

  useEffect(() => {
    if (isLoading && currentMessage) {
      setDisplayedMessage('');
      let displayText = '';
      let charIndex = 0;
      const typingInterval = setInterval(() => {
        if (charIndex < currentMessage.length) {
        displayText += currentMessage[charIndex];
        setDisplayedMessage(displayText);
        charIndex++
      } else {
        clearInterval(typingInterval);
      }
      if (charIndex >= currentMessage.length) {
        clearInterval(typingInterval);
      }
      }, 50);
      return () => clearInterval(typingInterval);
  }
  }, [currentMessage, isLoading]);

  const onUpload = async (files) => {
    if (files[0] && files[0].type !== 'application/pdf') {
      setUploadError('Only PDF files are allowed.');
      setIsLoading(false);
      return;
    }
    const formData = new FormData();

    formData.append('file', files[0]);

    const config = {
      headers: {'Content-Type': 'multipart/form-data'},
      withCredentials: true,
    }
    try {
      const response = await axios.post('https://aivispitchstackserver.azurewebsites.net/uploads', formData, config);
      setFileHash(response.data.fileHash);
      console.log('Response filehash:',response.data.fileHash);
      console.log('Upload successful', response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
    };

  useEffect(() => {
    if (isUploadComplete && fileHash) {
      navigate('/res');
    }
  }, [isUploadComplete, navigate]);


  useEffect(() => {
    const dropElement = drop.current;

    const removeEventListeners = () => {
      const dropElement = drop.current;
      if (dropElement) {
        dropElement.removeEventListener('dragover', handleDragOver);
        dropElement.removeEventListener('drop', handleDrop)
      }
    }

    const handleDragOver = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDrop = async (e) => {
      e.preventDefault();
      e.stopPropagation();
    
      const {files} = e.dataTransfer;
    
      if (files && files.length) {
        setUploadError('');
        setIsLoading(true);
        await onUpload(files);
        setIsLoading(false);
        removeEventListeners()
        setUploadComplete(true);
        setRetryAttempt(false);
      }
      
    };

    if (dropElement) {
        drop.current.addEventListener('dragover', handleDragOver);
        drop.current.addEventListener('drop', handleDrop);
    }

    return removeEventListeners
  }, []);
  
  
  
  
  const handleFileSelect = (e) => {
    const { files } = e.target;
    
    if (files && files.length) {
      onUpload(files);
    }
  };

  const handleClick = () => {
    fileInput.current.click();
  }

  return (
    <div className={styles.dropbox}>
      {uploadError && (
        <div className={styles.errorMessage}>
          {uploadError}
        </div>
      )}
      {isLoading && (
        <div className={styles.loadingContainer}>
          <img src='/loading.svg' className={styles.placeholderImg}></img>
          <p>Loading. Please wait.</p>
          {displayedMessage}
        </div>
      )}
        <div ref={drop} className={`${styles.dragNdrop} ${isLoading ? styles.hidden : ''}`} onClick={handleClick}>
        Drop pitchstack her
        <span
          role='img'
          aria-label='emoji'
          className='area__icon'
        >
          &#128526;
        </span>
        <input
          type="file"
          ref={fileInput}
          onChange={handleFileSelect}
          style={{ display: "none" }}
          accept=".pdf"
          />
      </div>
    </div> 
    )
  };
