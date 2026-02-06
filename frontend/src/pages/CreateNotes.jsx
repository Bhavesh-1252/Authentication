import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from '@/components/ui/input'
import { Edit, Loader2, Plus, Trash2, X } from 'lucide-react'
import axios from 'axios'
import { toast } from 'sonner'
import { getData } from '@/context/UserContext'


const CreateNotes = () => {
  const { user } = getData()
  const [showForm, setShowForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [fetchedData, setFetchedData] = useState(null)
  const [file, setFile] = useState(null)
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    userId: ""
  })

  useEffect(() => {
    fetchData();
  }, [])

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        alert("File size should not exceed 5MB");
        return;
      }
      setFile(e.target.files[0]);
    }

  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev, [name]: value
    }))

  }

  const showFormFunction = () => {
    setShowForm(!showForm)
  }

  const fetchData = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/user/getnotes`, { user });
      setFetchedData(res.data);


    } catch (error) {
      toast.error(error.message);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true)

    if (!formData.title && !formData.description && !file) {
      alert("Please provide at least a title, description or an image");
      setIsLoading(false)
      return;
    }


    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title)
    formDataToSend.append("description", formData.description)
    if (user && user._id) formDataToSend.append("userId", user._id)
    if (file) formDataToSend.append("image", file)

    try {
      let res;
      if (editId) {
        res = await axios.post(`${import.meta.env.VITE_API_URL}/user/notes/${editId}`, formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
      }
      else {
        res = await axios.post(`${import.meta.env.VITE_API_URL}/user/notes`, formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
      }

      toast.success(res.data.message)
      fetchData();
      setFormData({
        title: "",
        description: "",
      })
      setFile(null)
      setEditId(null)
    }
    catch (error) {
      if (error.response) {
        toast.error(error.message || "Failed to create note")
      }
    }
    finally {
      setIsLoading(false);
    }

  }

  const getImageUrl = (imageObj) => {
    if (!imageObj || !imageObj.data || !imageObj.data.data) return null;

    const base64String = btoa(new Uint8Array(imageObj.data.data).reduce(
      (data, byte) => data + String.fromCharCode(byte), ""
    ))

    return `data:${imageObj.contentType}; base64, ${base64String}`;
  }

  const deleteNote = async (id) => {
    setIsLoading(true);
    const ok = confirm("Are your sure want to delete the note?");
    if (!ok) return;

    try {
      const res = await axios.delete(`${import.meta.env.VITE_API_URL}/user/notes/${id}`);

      fetchData();
      toast.success(res.data.message)
    }
    catch (error) {
      toast.error(error.message);
    }
    finally {
      setIsLoading(false)
    }
  }

  const editNote = async (note) => {
    setEditId(note._id)
    setFormData({
      title: note.title,
      description: note.description
    })
    setShowForm(true)
  }

  return (
    <div className='relative top-0 h-screen  w-full overflow-hidden'>
      <div className='flex flex-col to-muted/20'></div>
      <div className='flex-1 flex p-4'>

        <Button onClick={showFormFunction} className='cursor-pointer p-3 rounded-full bg-green-600 hover:bg-green-700 absolute right-10 bottom-20  h-fit'>
          <Plus />
        </Button>

        <div className={` absolute z-40  bg-white max-w-xl right-10 ${showForm ? "bottom-20" : "-bottom-150"} border-1 border-black/10 shadow-lg rounded-lg transition-all`}>

          <Button onClick={() => setShowForm(false)} className={"cursor-pointer bg-transparent hover:bg-transparent p-0 text-black m-2"}>
            <X className='transform scale-110' />
          </Button>

          <form action="" className='flex flex-col justify-center pt-0 p-5 w-full gap-4' onSubmit={handleSubmit}>
            <Input
              type={"text"} className={""}
              onChange={handleChange} placeholder="Title"
              name="title" value={formData.title} />
            <textarea
              name="description"
              onChange={handleChange}
              value={formData.description} id=""
              className='border-1 border-slate-200 shadow-xs rounded-md p-3'
              rows="4" placeholder='Description'></textarea>
            <Input
              name="image" type={"file"}
              onChange={handleFileChange} className={""}
              placeholder={"Upload file"} accept={"image/*"} />

            <Button type={"submit"} className={"bg-green-600 hover:bg-green-700"}>

              {isLoading ? (<><Loader2 className="w-4 h-4 animate-spin mr-2" /> Loading...</>) : "Create Task"}

            </Button>
          </form>
        </div>

        {fetchedData &&
          <div className='grid grid-cols-6 items-start w-full gap-5 my-16 mx-4'>
            {fetchedData.data.map((value) => (
              <Card key={value._id} className="relative mx-auto w-full max-w-sm pt-0 h-fit rounded-xl">
                <div className="absolute inset-0 z-30 aspect-video  rounded-t-xl" />
                {value.image ?
                  <img
                    src={getImageUrl(value.image)}
                    alt="Event cover"
                    className="relative z-20 aspect-video w-full object-cover rounded-t-xl" />
                  :
                  <img
                    src="https://avatar.vercel.sh/shadcn1"
                    alt="Event cover"
                    className="relative z-20 aspect-video w-full object-cover brightness-20 grayscale dark:brightness-40 rounded-t-xl" />
                }
                <CardHeader>
                  <CardTitle>{value.title}</CardTitle>
                  <CardDescription>
                    {value.description}
                  </CardDescription>
                </CardHeader>

                <CardFooter>
                  <button onClick={() => editNote(value)} className='cursor-pointer mr-2'> <Edit className='w-4 h-4 text-yellow-600' /></button>
                  <button onClick={() => deleteNote(value._id)} className='cursor-pointer'><Trash2 className='w-4 h-4 text-red-700' /></button>
                </CardFooter>
              </Card>
            ))}
          </div>
        }
      </div>
    </div >
  )
}

export default CreateNotes
