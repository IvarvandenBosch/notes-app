import { useState, useRef, useEffect, ReactNode, Component } from 'react'
import './App.css'
import moment from "moment";
import useLocalStorage from './useLocalStorage';
import { useBetween } from "use-between"
import ListIcon from './components/ListIcon'

interface SideBarNotesProps {
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
  filteredNotes: Array<1>;
  createNote: (e: any) => Function;
  setShownNoteIndex: (index: number) => void;
  animation: Boolean;
  expanded: Boolean;
  deleteNote: (e: any, index: Number) => Function;
  date: string;
  handleNoteClick: (index: Number) => Function;
}

class SideBarNotes extends Component<SideBarNotesProps> {
  render() {
    return (
      <div className={`sidebar ${this.props.expanded ? 'expanded' : 'collapsed'}`}>
      <section className='top'>   
        <section className='flex'>  
          <h3 className='title'>Notes</h3>
          <button className="add" onClick={this.props.createNote}>+</button>
        </section>
        <section className='search'>
          <input type="text" value={this.props.searchTerm} onChange={(e) => this.props.setSearchTerm(e.target.value)} placeholder='Search...'/>
        </section>
      </section>
      <hr />
      {this.props.filteredNotes.map((note: any, index:number) => {
        return (
          <>
            <div key={index} onClick={() => this.props.handleNoteClick(index)} className={`notecard ${this.props.animation && 'anim'}`}>
              <h3>{note.title}</h3>
              <p>{note.content}</p>
              <button className='delete' onClick={(e) => this.props.deleteNote(e, index)}><svg fill='#f1f1f1' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20px" height="20px"><path d="M 10 2 L 9 3 L 4 3 L 4 5 L 5 5 L 5 20 C 5 20.522222 5.1913289 21.05461 5.5683594 21.431641 C 5.9453899 21.808671 6.4777778 22 7 22 L 17 22 C 17.522222 22 18.05461 21.808671 18.431641 21.431641 C 18.808671 21.05461 19 20.522222 19 20 L 19 5 L 20 5 L 20 3 L 15 3 L 14 2 L 10 2 z M 7 5 L 17 5 L 17 20 L 7 20 L 7 5 z M 9 7 L 9 18 L 11 18 L 11 7 L 9 7 z M 13 7 L 13 18 L 15 18 L 15 7 L 13 7 z"/></svg></button>
              <p style={{color: '#4b4b4b', marginTop: '4px'}}>{note.createdAt.split('|')[0] === this.props.date ? note.createdAt.split('|')[1] : note.createdAt.split('|')[0]}</p>
            </div>
          </>
        )
      })
      }
    </div>
  )
}
}

function App() {
  // current time and date 
  const date = moment().format("DD-MM-YYYY")
  const [searchTerm, setSearchTerm] = useState("");
  const [notes, setNotes] = useLocalStorage('note', [
    {title: 'New note', content:'click here to edit!', categories: ["sexy", "notSexy"] , createdAt: `${moment().format("DD-MM-YYYY|hh:mm:ss")}`},
  ])
  const [shownNoteIndex, setShownNoteIndex] = useState(0)
  const [animation, setAnimation] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const filteredNotes = 
    notes.filter((val:any)=> {
      if (searchTerm == ""){
        return val
      } else if (val.title.toLowerCase().includes(searchTerm.toLowerCase())) {
        return val
      }
    })
  
  function handleNoteClick(index: number) {
    setShownNoteIndex(index)
    if (window.innerWidth <= 500){
      setExpanded(true)
    }
  }

  function handleContentChange(index: number, e: any) {
    const newNotes = [...notes]
    newNotes[index].content = e.target.value
    setNotes(newNotes)
  }

  function handleTitleChange(index: number, e: any) {
    const newNotes = [...notes]
    newNotes[index].title = e.target.value
    setNotes(newNotes)
  }

  function createNote() {
    let newNotes = [...notes]
    const date = moment().format("DD-MM-YYYY|hh:mm:ss")
    const newNote =  {title: 'New note', content:'click here to edit!', categories: [], createdAt: `${date}`}
    newNotes = [newNote].concat(newNotes)
    setNotes(newNotes)
    setAnimation(true)

    setTimeout(() => {
      setAnimation(false)
    }, 500);
  }
  
  function deleteNote(e: any, index:number) {
    if (notes.length !== 1) {
      e.stopPropagation()
      let newNotes = [...notes]
      newNotes.splice(index, 1);
      setNotes(newNotes)
    }
  }

  // function categoryAdd(index: number) {
  //   const newNotes = [...notes]
  //   newNotes[index].categories = [...newNotes[index].categories, "New category"]
  //   setNotes(newNotes)
  // }

  
  return (
    <div className="App">
      {/* @ts-ignore */}
      <SideBarNotes 
        handleNoteClick={handleNoteClick}
        expanded={expanded}
        date={date} 
        deleteNote={deleteNote} 
        animation={animation} 
        setShownNoteIndex={setShownNoteIndex} 
        filteredNotes={filteredNotes} createNote={createNote} 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        key={1} 
      />

      {(filteredNotes.map((note: any, index:number) => {  
          return (
            index === shownNoteIndex ? 
            (<div key={index} className={`note ${expanded ? 'expanded' : 'collapsed'}`}>
              <input className="title" value={note.title} onChange={(e) => handleTitleChange(index, e)}/>
              <hr />
              <div style={{display: 'flex', gap: '5px', marginTop: '10px'}}>{note.categories.map((category: string) => {
                return 
              })}
              </div>
              <button className='add' onClick={ () => categoryAdd(index)}>+</button>
              <textarea value={notes[index].content} onChange={(e) => handleContentChange(index, e)} />
              <div className='list' onClick={() => setExpanded(false)}><ListIcon width="20px" height="20px" /></div>
            </div>
            ) : (
              ''
            )
          )
        })
      )}
      {filteredNotes.length === 0 && 
        <div className='note'>
          <h3>Nothing to see here!</h3>
          <hr />
        </div>
      }
  </div>
)
}



export default App

function categoryAdd(index: number): void {
  throw new Error('Function not implemented.');
}

