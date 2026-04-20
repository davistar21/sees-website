import { useEffect, useState } from "react";
import { supabase, type HodProfile } from "../lib/supabase";

const Hod = () => {
  const [hod, setHod] = useState<HodProfile | null>(null);

  useEffect(() => {
    supabase
      .from("hod_profile")
      .select("*")
      .limit(1)
      .single()
      .then(({ data }) => {
        if (data) setHod(data);
      });
  }, []);

  const name = hod?.name ?? "Head of Department";
  const title = hod?.title ?? "Professor";
  const bio = hod?.bio ?? "Our vision is to be a globally recognized leader in Electrical and Electronics Engineering, pioneering innovation, and cultivating future-ready engineers who can solve the world's most pressing technological challenges.";
  const image = hod?.image_url ?? "/hod.png";
  const contact = hod?.contact_email ? `mailto:${hod.contact_email}` : "";

  return (
    <div>
      <div className="hod-container">
        <div className="main-hod">
          <div className="left-text">
            <div className="left-title">Meet the HOD</div>
            <div className="left-content">
              <p style={{ color: "#013f31", fontWeight: 600, marginBottom: "4px" }}>{name}</p>
              {title && <p style={{ color: "#787878", fontSize: "0.85rem", marginBottom: "12px" }}>{title}</p>}
              {bio}
            </div>
            <div className="left-contact">
              <a href={contact || "mailto:hod.eeed@unilag.edu.ng"}>Contact</a>
            </div>
          </div>

          <div
            className="right-img"
            style={{ backgroundImage: `url(${image})` }}
          />
        </div>
      </div>
    </div>
  );
};

export default Hod;