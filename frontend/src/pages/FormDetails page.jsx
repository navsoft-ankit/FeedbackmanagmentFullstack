import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function FormDetails() {
  const { id } = useParams();
  const [form, setForm] = useState(null);

  useEffect(() => {
    const load = async () => {
      const res = await api.get(`/forms/${id}`);
      setForm(res.data);
    };

    load();
  }, [id]);

  if (!form) return <p>Loading...</p>;

  return (
    <div>
      <h2>{form.title}</h2>
      <p>{form.description}</p>

      {form.questions?.map((q) => (
        <div key={q.id}>
          <h4>{q.text}</h4>
        </div>
      ))}
    </div>
  );
}