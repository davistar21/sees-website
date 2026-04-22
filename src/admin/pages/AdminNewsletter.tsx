import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Mail, Trash2, Download } from "lucide-react";

type Subscriber = {
  id: string;
  email: string;
  created_at: string;
};

const AdminNewsletter = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubscribers = async () => {
    const { data } = await supabase
      .from("subscribers")
      .select("*")
      .order("created_at", { ascending: false });
    setSubscribers(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this subscriber?")) return;
    await supabase.from("subscribers").delete().eq("id", id);
    fetchSubscribers();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Newsletter</h2>
          <p className="text-sm text-gray-500">People subscribed via the homepage form</p>
        </div>
        {subscribers.length > 0 && (
          <button
            onClick={() => {
              const csv = [
                "Email,Subscribed",
                ...subscribers.map((s) =>
                  `${s.email},${new Date(s.created_at).toLocaleDateString()}`
                ),
              ].join("\n");
              const blob = new Blob([csv], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `sees-subscribers-${new Date().toISOString().split("T")[0]}.csv`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="flex items-center gap-2 bg-swamp text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#02543d] transition-colors shrink-0"
          >
            <Download size={15} /> Export CSV
          </button>
        )}
      </div>

      {!loading && (
        <div className="bg-white rounded-2xl p-4 border border-gray-200 flex items-center gap-3">
          <div className="w-10 h-10 bg-swamp/10 rounded-xl flex items-center justify-center">
            <Mail size={18} className="text-swamp" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{subscribers.length}</p>
            <p className="text-sm text-gray-500">Total subscribers</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : subscribers.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No subscribers yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">#</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Email</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Subscribed</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {subscribers.map((sub, i) => (
                <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                  <td className="px-4 py-3 text-gray-900">{sub.email}</td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                    {new Date(sub.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(sub.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors float-right"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminNewsletter;
