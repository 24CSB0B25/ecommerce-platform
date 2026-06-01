function Footer() {
  return (
    <footer
      className="
        mt-24
        bg-slate-950
        border-t
        border-slate-800
      "
    >
      <div
        className="
          max-w-7xl
          mx-auto
          px-8
          py-12
          grid
          md:grid-cols-4
          gap-10
        "
      >
        {/* Brand */}

        <div>
          <h2
            className="
              text-3xl
              font-bold
              text-amber-400
              mb-4
            "
          >
            NexusStore
          </h2>

          <p
            className="
              text-slate-400
              leading-7
            "
          >
            Premium shopping experience
            for electronics, laptops,
            audio devices and more.
          </p>
        </div>

        {/* Categories */}

        <div>
          <h3
            className="
              font-bold
              mb-4
            "
          >
            Categories
          </h3>

          <ul
            className="
              space-y-3
              text-slate-400
            "
          >
            <li>Mobiles</li>
            <li>Laptops</li>
            <li>Audio</li>
            <li>Accessories</li>
          </ul>
        </div>

        {/* Quick Links */}

        <div>
          <h3
            className="
              font-bold
              mb-4
            "
          >
            Quick Links
          </h3>

          <ul
            className="
              space-y-3
              text-slate-400
            "
          >
            <li>Home</li>
            <li>Cart</li>
            <li>Orders</li>
            <li>Dashboard</li>
          </ul>
        </div>

        {/* Contact */}

        <div>
          <h3
            className="
              font-bold
              mb-4
            "
          >
            Contact
          </h3>

          <ul
            className="
              space-y-3
              text-slate-400
            "
          >
            <li>support@nexusstore.com</li>
            <li>+91 99999 99999</li>
            <li>India</li>
          </ul>
        </div>
      </div>

      <div
        className="
          border-t
          border-slate-800
          py-6
          text-center
          text-slate-500
        "
      >
        © 2026 NexusStore. All Rights Reserved.
      </div>
    </footer>
  );
}

export default Footer;