import React from "react";
import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { name: "Accueil", href: "#" },
    { name: "Services", href: "#" },
    { name: "À Propos", href: "#" },
    { name: "Contact", href: "#" },
  ];

  const socialLinks = [
    { icon: FaInstagram, href: "https://instagram.com", label: "Instagram" },
    { icon: FaLinkedin, href: "https://linkedin.com", label: "LinkedIn" },
    {
      icon: FaGithub,
      href: "https://github.com/elamaimhamza",
      label: "GitHub",
    },
  ];

  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-2 gap-8 border-b border-gray-700 pb-8">
          {/* Section 1: Nom du Site */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-2xl font-bold text-indigo-400">Ecomsite</h3>
            <p className="mt-2 text-gray-400 text-sm">
              trouvez le T-shirt parfait qui parle pour vous. Découvrez des
              designs exclusifs, fabriqués pour durer et pensés pour chaque
              passion. L'endroit idéal pour rafraîchir votre collection et
              affirmer votre identité.
            </p>
          </div>

          {/* Section 4: Réseaux Sociaux */}
          <div className="flex justify-center">
            <div>
              <h4 className="text-lg font-semibold mb-3  text-white">
                Suivez-nous
              </h4>
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="text-gray-400 hover:text-indigo-400 transition duration-300"
                  >
                    <social.icon className="h-6 w-6" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Pied de page inférieur (Copyright) */}
        <div className="pt-8 text-center">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} Ecomsite. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
