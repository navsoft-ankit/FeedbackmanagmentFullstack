import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import "../styles/forms.css";

export default function AdminFormViewPage() {
  const { id } = useParams();
  const [form, setForm] = useState(null);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await api.get(`/forms/${id}`);
        setForm(res.data);
      } catch (err) {
        console.log(err);
        alert("Failed to load form");
      }
    };
    fetchForm();
  }, [id]);

  if (!form) return <h3>Loading...</h3>;

  return (
    <div>
      <h1>{form.title}</h1>
      <p>{form.description}</p>
      {form.questions.map((q) => (
        <div key={q.id}>
          <h3>{q.text}</h3>
          <p>Type: {q.type}</p>
          {q.options?.length > 0 && <p>Options: {q.options.join(", ")}</p>}
        </div>
      ))}
    </div>
  );
}