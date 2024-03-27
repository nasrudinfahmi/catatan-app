const formatIndonesianDate = (date) => {
  const options = { day: "2-digit", month: "long", year: "numeric" };
  const formattedDate = new Date(date).toLocaleDateString("id-ID", options);
  return formattedDate;
};

const currentDate = () => {
  const date = new Date();
  return formatIndonesianDate(date);
};

const dummyNote = [
  {
    id: "note-1",
    title: "Hai, Selamat Datang!",
    textNote:
      "Hai! Selamat datang di aplikasi catatan ini. Semoga harimu menyenangkan!",
    isArchived: false,
    createdAt: currentDate(),
  },
];

const getQuery = (key) => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const titleValue = urlParams.get(key);

  return titleValue;
};

const getAllNotes = () => {
  const datas = JSON.parse(localStorage.getItem("notes")) || [];

  if (datas.length === 0) {
    localStorage.setItem("notes", JSON.stringify(dummyNote));
    return dummyNote;
  }

  return datas;
};

const getNotes = (isArchived) => {
  const allNotes = getAllNotes();

  const filteredNotes = isArchived
    ? allNotes.filter((note) => note.isArchived)
    : allNotes.filter((note) => !note.isArchived);

  return filteredNotes;
};

const saveNote = ({ title, textNote, isArchived }) => {
  const notes = getAllNotes();
  const $1 = Math.round(Math.random() * 500);
  const $2 = Date.now().toString(36).substring(2);
  const $3 = Math.round(Math.random() * 1000);
  const id = `${$1}${$2}${$3}`;

  notes.push({
    id,
    title,
    textNote,
    isArchived,
    createdAt: currentDate(),
  });

  localStorage.setItem("notes", JSON.stringify(notes));
};

const editNote = ({ id, title, textNote, isArchived }) => {
  let allNotes = getAllNotes();

  allNotes = allNotes.map((note) => {
    if (note.id === id) {
      return { id, title, textNote, isArchived, createdAt: currentDate() };
    }
    return note;
  });

  localStorage.setItem("notes", JSON.stringify(allNotes));
};

const generateNoteCards = (notes, wrapperElement) => {
  wrapperElement.innerHTML = "";
  const titleValue = getQuery("title");

  if (titleValue) {
    const filteredNotes = notes.filter((note) => {
      return note.title.toLowerCase().includes(titleValue.toLowerCase());
    });

    filteredNotes.forEach((note) => {
      const { id, title, textNote, createdAt } = note;
      wrapperElement.innerHTML += createNoteCard({
        id,
        title,
        textNote,
        date: createdAt,
      });
    });
  } else {
    notes.forEach((note) => {
      const { id, title, textNote, createdAt } = note;
      wrapperElement.innerHTML += createNoteCard({
        id,
        title,
        textNote,
        date: createdAt,
      });
    });
  }
};

const renderNoteCard = (isArchived, wrapperElement) => {
  const notes = getNotes(isArchived);

  if (notes.length === 0) {
    wrapperElement.innerHTML = notFoundElement();
    return;
  }

  generateNoteCards(notes, wrapperElement);
};

const handleInputSearch = (e, notes) => {
  const keyword = e.target.value.trim();

  const url = new URL(window.location.href);
  const urlParams = new URLSearchParams(url.search);

  if (keyword === "") urlParams.delete("title");
  if (keyword !== "") urlParams.set("title", keyword);

  url.search = urlParams.toString();

  history.replaceState(null, "", url);

  const filteredNotes = notes.filter((note) => {
    return note.title.toLowerCase().includes(keyword.toLowerCase());
  });

  if (filteredNotes.length === 0) {
    noteWrapperElement.innerHTML = notFoundElement();
  } else {
    generateNoteCards(filteredNotes, noteWrapperElement);
  }
};

const handleDeleteNote = (id) => {
  let allNotes = getAllNotes();
  allNotes = allNotes.filter((note) => note.id !== id);

  localStorage.setItem("notes", JSON.stringify(allNotes));
};

const handleArchiveNote = (id) => {
  let allNotes = getAllNotes();
  allNotes = allNotes.map((note) => {
    if (note.id === id) {
      return { ...note, isArchived: true };
    }
    return note;
  });

  localStorage.setItem("notes", JSON.stringify(allNotes));
};

const handleUnArchiveNote = (id) => {
  let allNotes = getAllNotes();
  allNotes = allNotes.map((note) => {
    if (note.id === id) {
      return { ...note, isArchived: false };
    }
    return note;
  });

  localStorage.setItem("notes", JSON.stringify(allNotes));
};

const onDeleteNote = (target, isArchived, wrapperElement) => {
  const isConfirmed = confirm("Yakin ingin menghapus catatan ini?");

  if (!isConfirmed) return;

  const id = target.closest(".note").id;

  handleDeleteNote(id);
  renderNoteCard(isArchived, wrapperElement);
};

const onArchiveNote = (target, isArchived, wrapperElement) => {
  const id = target.closest(".note").id;

  isArchived ? handleUnArchiveNote(id) : handleArchiveNote(id);
  renderNoteCard(isArchived, wrapperElement);
};

const createNoteCard = ({ id, title, date, textNote }) => {
  return `
    <article class="note" id='${id}'>
      <a href="detail.html?id=${id}">
        <header class="note__header">
          <h2 class="note__header__title">${title}</h2>
          <span class="note__header__date">${date}</span>
        </header>
      </a>
      <div class="note__main">
        <div class="note__main__text clamp-2">${textNote}</div>
        <div class="note-actions">
          <button type="button" class="btn-note-act btn-delete" aria-label="hapus catatan ${title}">
            <i class="fa-solid fa-trash fa-lg" style="color: #ffffff;"></i>
          </button>
          <button type="button" class="btn-note-act btn-archive" aria-label="arsip atau jangan arsipkan catatan ${title}">
            <i class="fa-solid fa-box-archive fa-lg" style="color: #fcfcfc;"></i>
          </button>
        </div>
      </div>
    </article>
  `;
};

const createDetailNote = ({ id, title, date, textNote }) => {
  return `
    <article class="note" id='${id}'>
      <header class="note__header">
        <h2 class="note__header__title">${title}</h2>
        <span class="note__header__date">${date}</span>
      </header>
      <div class="note__main">
        <div class="note__main__text">${textNote}</div>
        <div class="note-actions">
          <button type="button" class="btn-note-act btn-delete" aria-label="hapus catatan ${title}">
            <i class="fa-solid fa-trash fa-lg" style="color: #ffffff;"></i>
          </button>
          <button type="button" class="btn-note-act btn-archive" aria-label="arsip atau jangan arsipkan catatan ${title}">
            <i class="fa-solid fa-box-archive fa-lg" style="color: #fcfcfc;"></i>
          </button>
          <button type="button" class="btn-note-act btn-edit" aria-label="arsip atau jangan arsipkan catatan ${title}">
            <i class="fa-solid fa-pen fa-lg" style="color: #ffffff;"></i>
          </button>
        </div>
      </div>
    </article>
  `;
};

const notFoundElement = () => {
  return `<h2 class="not-found">Tidak Ada Catatan</h2>`;
};

const footerChilds = () => {
  return `
  <a
    class="action"
    href="/"
    title="Catatan"
    id="btn-catatan"
    aria-label="Catatan"
  >
    <i class="fa-regular fa-note-sticky fa-xl"></i>
    <span class="text-act">Catatan</span>
  </a>
  <a
    class="action"
    href="tambah.html"
    title="tambah"
    id="btn-tambah"
    aria-label="Tambah Catatan"
  >
    <i class="fa-solid fa-plus fa-xl"></i>
    <span class="text-act">tambah</span>
  </a>
  <a
    class="action"
    href="arsip.html"
    title="Arsip"
    id="btn-arsip"
    aria-label="Arsip Catatan"
  >
    <i class="fa-regular fa-folder fa-xl"></i>
    <span class="text-act">arsip</span>
  </a>
  `;
};
