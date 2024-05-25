'use client';

import { IArticleTableModel } from '@/models/articles.model';
import { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface Category {
  id: number;
  title: string;
}

interface IProps {
  initialData: [IArticleTableModel[], Category[]];
}

const FormEditArticle = ({ initialData }: IProps) => {
  const [initArticleData, categories] = initialData;

  const [formData, setFormData] = useState({
    logo: initArticleData[0].logo || '',
    title: initArticleData[0].title || '',
    cpu: initArticleData[0].cpu || '',
    description: initArticleData[0].description.replace(/"/g, '""') || '',
    text: initArticleData[0].text || '',
    author: initArticleData[0].author || '',
    date: initArticleData[0].date || '',
    cat: initArticleData[0].cat || '',
    folder: initArticleData[0].folder || '',
  });

  const handleChange = ({
    name,
    value,
  }: EventTarget &
    (HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement)) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div>
      <input
        name="logo"
        type="text"
        value={formData.logo}
        size={40}
        maxLength={255}
        readOnly
      />

      <h1 className="eTitle_useful">Editing Articles</h1>
      <p>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={initArticleData[0].source}
        >
          Source
        </a>
      </p>
      <p>
        Article Title:
        <br />
        <textarea
          name="title"
          cols={40}
          rows={2}
          value={formData.title}
          onChange={(e) => handleChange(e.target)}
        ></textarea>
      </p>
      <p>
        Slug (Human-readable URL)
        <br />
        (Enter only English characters without tags, use hyphens instead of
        spaces, it will be the URL):
        <br />
        <textarea
          name="cpu"
          cols={40}
          rows={2}
          value={formData.cpu}
          onChange={(e) => handleChange(e.target)}
        ></textarea>
      </p>
      <p>
        Short Description
        <br />
        (Enter text only without tags, replace double quotes with «», it will be
        written in meta_description):
        <br />
        <textarea
          name="description"
          cols={60}
          rows={20}
          value={formData.description}
          onChange={(e) => handleChange(e.target)}
        ></textarea>
      </p>

      <Editor
        apiKey="8htugre4jjfi2py064rvhgmyru3t2pa5xk3zuiia7arw0fqh"
        init={{
          plugins:
            'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage advtemplate mentions tinycomments tableofcontents footnotes mergetags autocorrect typography inlinecss markdown',
          toolbar:
            'code | visualblocks | undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
          tinycomments_mode: 'embedded',
          tinycomments_author: 'Author name',
          mergetags_list: [
            { value: 'First.Name', title: 'First Name' },
            { value: 'Email', title: 'Email' },
          ],
        }}
        initialValue={formData.text}
      />
      <p>
        Author:
        <br />
        <textarea
          name="author"
          cols={60}
          rows={2}
          value={formData.author}
          onChange={(e) => handleChange(e.target)}
        ></textarea>
      </p>
      <p>
        Date:
        <br />
        <textarea
          name="date"
          cols={30}
          rows={1}
          value={formData.date}
          onChange={(e) => handleChange(e.target)}
        ></textarea>
      </p>
      <p>
        Category
        <br />
        <select
          name="cat"
          value={formData.cat}
          onChange={(e) => handleChange(e.target)}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.title}
            </option>
          ))}
        </select>
      </p>
      <p>
        Folder Name for Images for this Article:
        <br />
        <textarea
          name="folder"
          cols={40}
          rows={1}
          value={formData.folder}
          onChange={(e) => handleChange(e.target)}
        ></textarea>
      </p>
    </div>
  );
};

export default FormEditArticle;
