import React from 'react'
import { Component } from 'react';

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
    filteredCategories: [string]
    setFilteredCategories: (filteredCategories: any) => void;
  }
  
  export default class SideBarNotes extends Component<SideBarNotesProps> {
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
  