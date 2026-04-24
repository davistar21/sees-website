import { useEffect, useState } from "react";
import { supabase, type HodProfile } from "../lib/supabase";

const Hod = () => {
  const [hod, setHod] = useState<HodProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("hod_profile")
      .select("*")
      .limit(1)
      .single()
      .then(({ data }) => {
        if (data) setHod(data);
        setLoading(false);
      });
  }, []);

  if (loading || !hod) return null;

  const image = hod.image_url ?? "/hod.png";
  const contact = hod.contact_email ? `mailto:${hod.contact_email}` : "mailto:hod.eeed@unilag.edu.ng";

  return (
    <div>
      <div className="hod-container">
        <div className="main-hod">
          <div className="left-text">
            <div className="left-title">Meet the HOD</div>
            <div className="left-content">
              <p style={{ color: "#013f31", fontWeight: 600, marginBottom: "4px" }}>{hod.name}</p>
              {hod.title && <p style={{ color: "#787878", fontSize: "0.85rem", marginBottom: "12px" }}>{hod.title}</p>}
              {hod.bio}
            </div>
            <div className="left-contact">
              <a href={contact}>Contact</a>
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