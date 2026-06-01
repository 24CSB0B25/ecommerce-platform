import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();

  return (
    <section
      className="
        bg-gradient-to-b
        from-slate-900
        via-slate-950
        to-slate-950
        text-center
        py-24
        px-6
      "
    >
      <div
        className="
          inline-block
          border
          border-amber-500
          text-amber-400
          rounded-full
          px-6
          py-2
          mb-8
          font-medium
        "
      >
        🚀 INDIA'S FAVOURITE ONLINE STORE
      </div>

      <h1
        className="
          text-6xl
          font-extrabold
          max-w-4xl
          mx-auto
          leading-tight
        "
      >
        Everything You Need,
        <br />
        <span className="text-amber-400">
          Delivered Fast
        </span>
      </h1>

      <p
        className="
          mt-8
          text-slate-400
          text-xl
          max-w-3xl
          mx-auto
        "
      >
        Shop Electronics, Laptops,
        Audio Devices, Smartphones
        and more.
      </p>

      <div
        className="
          mt-10
          flex
          justify-center
          gap-4
        "
      >
        <button
          onClick={() =>
            document
              .getElementById("products")
              ?.scrollIntoView({
                behavior: "smooth",
              })
          }
          className="
            bg-amber-500
            hover:bg-amber-400
            text-black
            px-10
            py-4
            rounded-xl
            font-bold
          "
        >
          Shop Now →
        </button>

        <button
          onClick={() =>
            navigate("/register")
          }
          className="
            bg-slate-800
            hover:bg-slate-700
            px-10
            py-4
            rounded-xl
            font-bold
          "
        >
          Join Free Today
        </button>
      </div>
    </section>
  );
}

export default Hero;