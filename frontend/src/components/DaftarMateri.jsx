function DaftarMateri({ materi = [] }) {
  return (
    <div>
      {materi.map((item) => (
        <div key={item.id}>
          <h3>{item.judul}</h3>
          <p>{item.mataKuliah}</p>
          <p>Pertemuan {item.pertemuan}</p>
          {item.tautan !== null && (
            <a href={item.tautan} target="_blank" rel="noreferrer">
              Buka
            </a>
          )}
        </div>
      ))}
    </div>
  );
}

export default DaftarMateri;