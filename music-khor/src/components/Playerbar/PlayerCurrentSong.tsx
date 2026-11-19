export default function PlayerCurrentSong({ image, title, artists }) {
  return (
    <div className="flex items-center gap-5 relative overflow-hidden">
      <picture
        className="w-14 h-14 rounded-md shadow-lg overflow-hidden sm:w-16 sm:h-16"
        style={{ backgroundColor: "#09090b" }}
      >
        {image ? (
          <img src={image} alt={title} className="object-cover w-full h-full" />
        ) : (
          <div className="w-14 h-14"></div>
        )}
      </picture>

      <div className="flex flex-col">
        <h3 className="font-semibold text-sm block">{title}</h3>
        <span className="text-xs opacity-80">{artists}</span>
      </div>
    </div>
  );
}
