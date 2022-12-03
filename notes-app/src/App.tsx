import { useState, useRef, useEffect, ReactNode, Component } from "react";
import "./App.css";
import moment from "moment";
import useLocalStorage from "./useLocalStorage";
import SideBarNotes from "./components/SideBarNotes";
import ListIcon from "./components/ListIcon";

function App() {
  // current time and date
  const date = moment().format("DD-MM-YYYY");
  const [searchTerm, setSearchTerm] = useState("");
  const [notes, setNotes] = useLocalStorage("note", [
    {
      title: "New note",
      content: "",
      categories: ["sexy", "notSexy"],
      createdAt: `${moment().format("DD-MM-YYYY|hh:mm:ss")}`,
    },
  ]);
  const [shownNoteIndex, setShownNoteIndex] = useState(0);
  const [animation, setAnimation] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState([
    notes.categories,
  ]);

  const filteredNotes = notes.filter((val: any) => {
    if (searchTerm == "") {
      return val;
    } else if (val.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return val;
    }
  });

  function handleNoteClick(index: number) {
    setShownNoteIndex(index);
    if (window.innerWidth <= 500) {
      setExpanded(true);
    }
  }

  function handleContentChange(index: number, e: any) {
    const newNotes = [...notes];
    newNotes[index].content = e.target.value;
    setNotes(newNotes);
  }

  function handleTitleChange(index: number, e: any) {
    const newNotes = [...notes];
    newNotes[index].title = e.target.value;
    setNotes(newNotes);
  }

  function createNote() {
    let newNotes = [...notes];
    const date = moment().format("DD-MM-YYYY|hh:mm:ss");
    const newNote = {
      title: "New note",
      content: "",
      categories: ["test"],
      createdAt: `${date}`,
    };
    newNotes = [newNote].concat(newNotes);
    setNotes(newNotes);
    setAnimation(true);

    setTimeout(() => {
      setAnimation(false);
    }, 500);
  }

  function deleteNote(e: any, index: number) {
    if (notes.length !== 1) {
      e.stopPropagation();
      let newNotes = [...notes];
      newNotes.splice(index, 1);
      setNotes(newNotes);
    }
  }

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
        filteredNotes={filteredNotes}
        createNote={createNote}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        key={1}
        filteredCategories={filteredCategories}
        setFilteredCategories={setFilteredCategories}
      />

      {filteredNotes.map((note: any, index: number) => {
        return index === shownNoteIndex ? (
          <div
            key={index}
            className={`note ${expanded ? "expanded" : "collapsed"}`}
          >
            <input
              className="title"
              value={note.title}
              onChange={(e) => handleTitleChange(index, e)}
            />
            <hr />
            <div style={{ display: "flex", gap: "5px", marginTop: "10px" }}>
              {note.categories.map((category: string) => {
                return;
              })}
            </div>
            <button className="add" onClick={() => categoryAdd(index)}>
              +
            </button>
            <textarea
              placeholder="click here to edit!"
              value={notes[index].content}
              onChange={(e) => handleContentChange(index, e)}
            />
            <div className="list" onClick={() => setExpanded(false)}>
              <ListIcon width="20px" height="20px" />
            </div>
          </div>
        ) : (
          ""
        );
      })}
      {filteredNotes.length === 0 && (
        <div className="note">
          <h3>Nothing to see here!</h3>
          <hr />
        </div>
      )}
    </div>
  );
}

export default App;

function categoryAdd(index: number): void {
  throw new Error("Function not implemented.");
}
