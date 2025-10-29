const Executives = () => {
  return (
    <div className="min-h-[50vh] mt-30">
      <div className="mx-auto flex flex-col gap-12 items-center">
        <h2 className="text-center text-4xl md:text-5xl font-semibold text-swamp">
          Meet our Executives
        </h2>
        <div className="flex gap-4 scrollbar w-auto overflow-x-auto px-2 md:px-6 snap-x snap-mandatory">
          {[
            "contentone.jpg",
            "contenttwo.jpg",
            "contentone.jpg",
            "contenttwo.jpg",
          ].map((image, index) => (
            <img
              key={index}
              src={image}
              alt=""
              className="w-[250px] h-auto object-cover aspect-square rounded-2xl snap-center"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Executives;
