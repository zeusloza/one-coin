import { useRef } from "react";
import teamData from "@/data/one-coin-team.json";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

function TeamProfiles() {
  const sectionRef = useRef(null);
  const listRef = useRef(null);

  useGSAP(
    () => {
      const listElement = listRef.current;
      const sectionElement = sectionRef.current;

      if (
        listElement &&
        sectionElement &&
        listElement.scrollWidth > listElement.clientWidth
      ) {
        gsap.to(listElement, {
          x: () => -(listElement.scrollWidth - listElement.clientWidth) + "px",
          scrollTrigger: {
            trigger: sectionElement,
            start: "top top",
            end: "bottom top",
            markers: false,
            scrub: true,
            pin: true,
          },
        });
      }
    },
    { scope: sectionRef, dependencies: [teamData.members] }
  );

  return (
    <section
      id="team-profiles"
      ref={sectionRef}
      className="relative max-w-vw flex items-center overflow-hidden py-36"
    >
      <div ref={listRef}>
        <ul className="flex w-full p-4 gap-4 max-w-dvw">
          {teamData.members.map((member) => (
            <li
              key={member.id}
              id={`${member.id}`}
              className="aspect-[4/5] w-full grow-1 bg-white border-2 border-yellow-300 text-black p-8 gap-2 max-md:p-4 max-lg:flex-[0_0_100%] animate-fade-up"
            >
              <div className="aspect-square w-full bg-fuchsia-400 gap-2 p-1">
                <img src={member.photoUrl} alt={`${member.name}'s photo`} />
              </div>
              <div className="flex flex-col items-center justify-center gap-2">
                <h2 className="font-icebox uppercase">{member.name}</h2>
                <ul className="flex gap-2">
                  {member.socialProfiles.map((profile) => (
                    <li key={profile.platform} id={profile.platform}>
                      <a
                        href={profile.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          className="w-30-60"
                          src={`/logo-${profile.platform.toLowerCase()}.svg`}
                          alt={`${profile.platform} logo`}
                        />
                        <span className="hidden">{profile.platform}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default TeamProfiles;
