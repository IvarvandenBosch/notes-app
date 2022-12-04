import { useState } from "react";
import "./App.css";
import moment from "moment";
import useLocalStorage from "./useLocalStorage";
import SideBarNotes from "./components/SideBarNotes";
import ListIcon from "./components/svgs/ListIcon";
import DownloadIcon from "./components/svgs/DownloadIcon";

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
  const [ui, setUi] = useState({
    animation: false,
    expanded: false
  });

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
      setUi(
       {...ui,
        expanded: true});
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
    setUi({
      ...ui,
      animation: true
    });

    setTimeout(() => {
      setUi({
        ...ui,
        animation: false
      });
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

  function downloadNote(index: number) {
    const element = document.createElement("a");
    const file = new Blob([filteredNotes[index].content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${filteredNotes[index].title.replace(' ', '_')}.txt`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }

  return (
    <div className="App">
      {/* @ts-ignore */}
      <SideBarNotes
        handleNoteClick={handleNoteClick}
        ui={ui}
        setUi={setUi}
        date={date}
        deleteNote={deleteNote}
        setShownNoteIndex={setShownNoteIndex}
        filteredNotes={filteredNotes}
        createNote={createNote}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        key={1}
      />

      {filteredNotes.map((note: any, index: number) => {
        return index === shownNoteIndex ? (
          <div
            key={index}
            className={`note ${ui.expanded ? "expanded" : "collapsed"}`}
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
            <button className="download" onClick={() => downloadNote(index)}>
              <DownloadIcon width="20px" height="20px" />
            </button>
            <textarea
              placeholder="click here to edit!"
              value={notes[index].content}
              onChange={(e) => handleContentChange(index, e)}
            />
            <div className="list" onClick={() => setUi({
              ...ui,
              expanded: false
            })}>
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