/*
  LICENSE: MIT
  Created by: Lightnet

*/

// https://github.com/neutralinojs/neutralinojs/blob/main/server/router.cpp
// https://stackoverflow.com/questions/680929/how-to-extract-extension-from-filename-string-in-javascript/680982
// s

import React,{createRef, useEffect, useState} from "react";
import { nanoid16 } from "../../lib/helper";
import useFetch from '../hook/usefetch';
//import ContentEditable from "react-contenteditable";
import styles from './editor.module.css';

var re = /(?:\.([^.]+))?$/;

var textexts=[
  'txt'
  ,'md'
  ,'js'
  ,'xml'
  ,'html'
  ,'log'
  ,'xhtml'
  ,'json'
];

var imageexts=[
  'png'
  ,'gif'
  ,'jpg'
  ,'svg'
];

function checkExt(name){

}

export default function HyperDriveContent(){

  const [drive, setDrive] = useState('');
  const [dirname, setDirName] = useState('/');
  const [createDirName, setCreateDirName] = useState('/');
  const [dirList, setDirList] = useState([]);
  const [viewType, setViewType] = useState('dir');// dir, text, image, upload

  const [file,setFile] = useState('');
  const [textContent,setTextContent] = useState("");
  const contentEditable = createRef(null);

  const [selectedFile, setSelectedFile] = useState();
  const [isSelected,setIsSelected] = useState(false);

  //mount once
  useEffect(()=>{
    getDriveDir()
  },[])

  //event for text editor set up
  useEffect(()=>{
    if(viewType=='texteditor'){
      contentEditable.current.innerText = textContent;
    }
    if(viewType=='editortextnew'){
      contentEditable.current.innerText = textContent;
    }
  },[viewType])

  function typeDirName(event){
    setDirName(event.target.value)
  }

  function typeCreateDirName(event){
    setCreateDirName(event.target.value)
  }

  async function getDriveDir(){
    if(dirname=='/'){
      let data = await useFetch('http://localhost/drive');
      //console.log(data);
      if(data.error){
        console.log('Fetch Error get dir list.')
        return;
      }
      if(data.list){
        setDirList(data.list);
        setViewType('dir');
      }
    }else{
      DriveDirList(dirname)
    }
  }

  function typeTextContent(event){
    //console.log(event.target.innerText);
    //console.log(event.target.textContent);
    //setTextContent(event.target.textContent);
    //setTextContent(event.target.innerText);
    //setTextContent(event.currentTarget.textContent);
  }

  function typeFile(event){
    setFile(event.target.value);
  }

  async function getDrive(){
    let data = await useFetch('http://localhost/drive',{
        method:'POST'
      , body:JSON.stringify({
        mode:'drivekey'
      })
    });
    console.log(data);
    if(data.error){
      console.log('Fetch Error get content data.')
      return;
    }
    if(data.api=='drivekey'){
      setDrive(data.key);
      return;
    }
  }

  async function createDrive(){

  }

  function typeDrive(event){
    setDrive(event.target.value)
  }

  async function clickEdit(filename){
    let data = await useFetch('http://localhost/drive',{
        method:'POST'
      , body:JSON.stringify({
          dirname:dirname
        , file:filename
        , mode:'edit'
      })
    });
    console.log(data);
    if(data.error){
      console.log('Fetch Error get content data.')
      return;
    }
    if(typeof data.content === 'string'){
      setFile(filename);
      setTextContent(data.content);
      //contentEditable.current.innerText = data.content;
      setViewType('texteditor');
    }
  }

  async function clickTextSave(){
    //console.log("contentEditable.current.textContent");
    //console.log(contentEditable.current.textContent);
    console.log(contentEditable.current.innerHTML);

    let data = await useFetch('http://localhost/drive',{
        method:'POST'
      , body:JSON.stringify({
          dirname:dirname
        , file:file
        , content:contentEditable.current.innerText
        , mode:'save'
      })
    });
    console.log(data);
    if(data.error){
      console.log('Fetch Error get content data.')
      return;
    }

    setViewType('dir');
    getDriveDir();

    //if(data.content){
      //setFile(filename);
      //setTextContent(data.content);
      //setViewType('texteditor');
    //}
  }
// https://stackoverflow.com/questions/42300528/javascript-phps-substr-alternative-on-javascript
  async function clickTextCreate(){

    let filestr = file;
    var ext = filestr.substring(filestr.lastIndexOf('.') + 1);
    if(ext=='txt'){

    }else{
      console.log('ext need it...');
      return;
    }

    let data = await useFetch('http://localhost/drive',{
        method:'POST'
      , body:JSON.stringify({
          dirname:dirname
        , file:file
        , content:contentEditable.current.innerText
        , mode:'create'
      })
    });
    console.log(data);
    if(data.error){
      console.log('Fetch Error get content data.')
      return;
    }

    setViewType('dir');
    getDriveDir();
    //if(data.content){
      //setFile(filename);
      //setTextContent(data.content);
      //setViewType('texteditor');
    //}
  }

  function clickEditCancel(){
    setViewType('dir');
  }

  function clickEditNew(){
    setViewType('editortextnew');
    setFile(nanoid16()+'.txt')
  }

  async function clickDeleteFile(filename){
    let data = await useFetch('http://localhost/drive',{
        method:'DELETE'
      , body:JSON.stringify({
          dirname:dirname
        , file:filename
        , mode:'delete'
      })
    });
    console.log(data);
    if(data.error){
      console.log('Fetch Error get content data.')
      return;
    }

    setViewType('dir')
    getDriveDir();
  }

  async function clickMakeDir(){
    let data = await useFetch('http://localhost/drive',{
        method:'POST'
      , body:JSON.stringify({
        dirname:createDirName
        , mode:'mkdir'
      })
    });
    console.log(data);
    if(data.error){
      console.log('Fetch Error get content data.')
      return;
    }
  }

  async function clickRemoveDir(){
    let data = await useFetch('http://localhost/drive',{
        method:'POST'
      , body:JSON.stringify({
        dirname:createDirName
        , mode:'rmdir'
      })
    });
    console.log(data);
    if(data.error){
      console.log('Fetch Error get content data.')
      return;
    }
  }

  function clickUpload(){
    setViewType('upload');
  }

  function clickDeleteDir(){
    
  }

  function changeFileSelect(event){
    setSelectedFile(event.target.files[0]);
		setIsSelected(true);
  }

  function clickUploadHandle(){
    console.log('upload');
    const formData = new FormData();
    formData.append('File', selectedFile);
    formData.append('dirname', dirname);
    fetch(
			'http://localhost/driveupload',
			{
				method: 'POST',
				body: formData,
			}
		)
			.then((response) => response.json())
			.then((result) => {
				console.log('Success:', result);
			})
			.catch((error) => {
				console.error('Error:', error);
			});
  }

  function viewMode(){
    if(viewType=='dir'){
      return dirList.map((item)=>{

        var ext = re.exec(item)[1];
        //var ext = item.substr(item.lastIndexOf('.') + 1);
        let bedit = <></>;
        let bdelete = <></>;
        if(ext){
          if(ext== 'txt'){
            bedit=<button onClick={()=>clickEdit(item)}>Edit</button>
            bdelete=<button onClick={()=>clickDeleteFile(item)}> Delete </button>
          }
        }else{

        }
        
        //console.log("NAME:",item)
        //console.log(ext);
        return <div key={item}>
            <label> {item}</label> {bedit} {bdelete}
          </div>
      })
    }else if(viewType=='texteditor'){

      return <>
        <div
          ref={contentEditable}
          className={styles.textEditor}
          suppressContentEditableWarning={true}
          onInput={typeTextContent}
          contentEditable={true}
          >
            
          </div><br />
        <button onClick={clickTextSave}> Save </button>
        <button onClick={clickEditCancel}> Cancel </button>
      </>
    }else if(viewType=='editortextnew'){
      return <>
        <label> File Name: </label> <input size="64" value={file} onChange={typeFile} /><br />
        <label> Text Content: </label> <br />
        <div 
          ref={contentEditable}
          className={styles.textEditor} 
          suppressContentEditableWarning={true}
          //dangerouslySetInnerHTML={{ __html: textContent }}
          contentEditable={true}
          >
            {textContent}
        </div><br />
        <button onClick={clickTextCreate}> Save </button>
        <button onClick={clickEditCancel}> Cancel </button>
      </>
    }else if(viewType=='image'){
      return <>
        <label> File Name: </label> <input size="64" value={file} onChange={typeFile} /><br />
        <button> Delete </button>
        <button onClick={clickEditCancel}> Cancel </button>
      </>
    }else if(viewType=='upload'){
      return <>
        <label> File Name: </label>
        <input type="file" name="file" onChange={changeFileSelect} />
        <button onClick={clickUploadHandle}> Upload </button>
        <button onClick={clickEditCancel}> Cancel </button>
      </>
    }
    return <></>
  }

  async function DriveDirList(name){
    let data = await useFetch('http://localhost/drive',{
        method:'POST'
      , body:JSON.stringify({
          dirname:name
        , mode:'dir'
      })
    });
    console.log(data);
    if(data.error){
      console.log('Fetch Error get content data.')
      setDirList([]);
      return;
    }
    if(data.list){
      setDirList(data.list);
    }
  }

  function typeDirEnter(event){
    console.log(event.code);
    if(event.code=='Enter'){
      DriveDirList(event.target.value);
    }
  }
  
  return <div>
    <div>
      <button onClick={getDriveDir}> Refresh </button>
      <button onClick={createDrive}> Create </button>
      <button onClick={getDrive}> Get </button>
      <input size="64" value={drive} onChange={typeDrive}/>
    </div>
    <div>
      <button onClick={clickEditNew}> New Text File </button>
      <button onClick={clickUpload}> Upload </button>
      <button onClick={clickMakeDir}> mkdir </button>
      <button onClick={clickRemoveDir}> rmdir </button>
      <input size="64" value={createDirName} onChange={typeCreateDirName}></input>
    </div>
    
    <div>
      <label> Directory </label><input size="64" value={dirname} onChange={typeDirName} onKeyUp={typeDirEnter} />
    </div>
    <div>
      {viewMode()}
    </div>
  
  </div>
}