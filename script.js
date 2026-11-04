document.addEventListener("DOMContentLoaded", function () {

    // Get elements from the DOM
    const noteContainer = document.getElementById("note-container");
    const newNoteButton = document.getElementById("new-note-button");
    const colorForm = document.getElementById("color-form");
    const colorInput = document.getElementById("color-input");

    // Local storage keys
    const NOTES_KEY = "notes";
    const COLOR_KEY = "noteColor";
    const COUNTER_KEY = "noteCounter";

    // Load saved data from local storage
    let noteColor = localStorage.getItem(COLOR_KEY) || "black";
    let noteCounter = Number(localStorage.getItem(COUNTER_KEY)) || 1;

    let savedNotes = [];

    try {
        savedNotes = JSON.parse(localStorage.getItem(NOTES_KEY)) || [];
    } catch (error) {
        savedNotes = [];
    }

    // Save all notes to local storage
    function saveNotes() {
        const notes = document.querySelectorAll(".note");

        const notesData = Array.from(notes).map(function (note) {
            return {
                id: note.dataset.noteId,
                value: note.value
            };
        });

        localStorage.setItem(NOTES_KEY, JSON.stringify(notesData));
        localStorage.setItem(COLOR_KEY, noteColor);
        localStorage.setItem(COUNTER_KEY, noteCounter);
    }

    // Create a new note
    function addNewNote(noteData = null) {
        const newNote = document.createElement("textarea");

        const noteId = noteData ? noteData.id : `Note ${noteCounter}`;

        newNote.classList.add("note");
        newNote.dataset.noteId = noteId;
        newNote.value = noteData ? noteData.value : noteId;
        newNote.style.backgroundColor = noteColor;

        noteContainer.appendChild(newNote);

        if (!noteData) {
            noteCounter++;
        }

        saveNotes();
    }

    // Restore saved notes when the page loads
    savedNotes.forEach(function (note) {
        addNewNote(note);
    });

    // Save a new note color and update existing notes
    colorForm.addEventListener("submit", function (event) {
        event.preventDefault();

        noteColor = colorInput.value;

        const notes = document.querySelectorAll(".note");

        notes.forEach(function (note) {
            note.style.backgroundColor = noteColor;
        });

        colorInput.value = "";

        saveNotes();
    });

    // Add a note when the button is clicked
    newNoteButton.addEventListener("click", function () {
        addNewNote();
    });

    // Remove a note when it is double-clicked
    document.addEventListener("dblclick", function (event) {
        if (event.target.classList.contains("note")) {
            event.target.remove();
            saveNotes();
        }
    });

    // Save changes when a note loses focus
    noteContainer.addEventListener("blur", function (event) {
        if (event.target.classList.contains("note")) {
            saveNotes();
        }
    }, true);

    // Add a note when the N key is pressed
    document.addEventListener("keydown", function (event) {
        if (
            event.key.toLowerCase() === "n" &&
            event.target.id !== "color-input" &&
            event.target.type !== "textarea"
        ) {
            addNewNote();
        }
    });

    // Save the current settings
    saveNotes();

});