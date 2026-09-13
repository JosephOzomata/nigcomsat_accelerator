import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Loader2, Save } from "lucide-react";
import { getSingleton, saveSingleton } from "../../services/firestore";
import { Field, Input, Textarea } from "../../components/admin/Field";
import ImageUploader from "../../components/admin/ImageUploader";

const SiteInfoEditor = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState({
    siteName: "",
    logo: "",
    contactEmail: "",
    contactPhone: "",
    address: "",
    footerText: "",
    facebook: "",
    twitter: "",
    instagram: "",
    linkedin: "",
    youtube: "",
  });

  useEffect(() => {
    (async () => {
      const doc = await getSingleton("siteInfo");
      if (doc) setData((prev) => ({ ...prev, ...doc }));
      setLoading(false);
    })();
  }, []);

  const set = (k) => (e) => setData((d) => ({ ...d, [k]: e.target.value }));

  const save = async () => {
    setSaving(true);
    try {
      await saveSingleton("siteInfo", data);
      toast.success("Site info updated");
    } catch (e) {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center gap-2 text-gray-500">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading...
      </div>
    );

  return (
    <>
      <Toaster position="top-right" />
      <div className="max-w-3xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Site Info</h1>
          <p className="text-sm text-gray-500 mt-1">
            Logo, contact details, footer, and social links.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
          <ImageUploader
            label="Site Logo"
            value={data.logo}
            onChange={(url) => setData((d) => ({ ...d, logo: url }))}
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Site Name">
              <Input value={data.siteName} onChange={set("siteName")} />
            </Field>
            <Field label="Contact Email">
              <Input value={data.contactEmail} onChange={set("contactEmail")} />
            </Field>
            <Field label="Contact Phone">
              <Input value={data.contactPhone} onChange={set("contactPhone")} />
            </Field>
            <Field label="Address">
              <Input value={data.address} onChange={set("address")} />
            </Field>
          </div>
          <Field label="Footer Text">
            <Textarea rows={3} value={data.footerText} onChange={set("footerText")} />
          </Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Facebook URL">
              <Input value={data.facebook} onChange={set("facebook")} />
            </Field>
            <Field label="Twitter / X URL">
              <Input value={data.twitter} onChange={set("twitter")} />
            </Field>
            <Field label="Instagram URL">
              <Input value={data.instagram} onChange={set("instagram")} />
            </Field>
            <Field label="LinkedIn URL">
              <Input value={data.linkedin} onChange={set("linkedin")} />
            </Field>
            <Field label="YouTube URL">
              <Input value={data.youtube} onChange={set("youtube")} />
            </Field>
          </div>

          <div className="pt-4 border-t border-gray-200 flex justify-end">
            <button
              onClick={save}
              disabled={saving}
              className="px-5 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm font-medium flex items-center gap-2 disabled:opacity-60"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SiteInfoEditor;