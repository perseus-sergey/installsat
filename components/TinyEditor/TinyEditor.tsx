import { Editor } from '@tinymce/tinymce-react';
import { MutableRefObject } from 'react';
import { Editor as CoreEditor } from 'tinymce';

interface ITinyEditorProps {
  editorApiKey: string;
  id: string;
  initialValue: string;
  editorRef: MutableRefObject<CoreEditor | null>;
  onEditorChange: (content: string) => void;
}

const TinyEditor = ({
  editorApiKey,
  id,
  initialValue,
  editorRef,
  onEditorChange,
}: ITinyEditorProps) => {
  return (
    <Editor
      onEditorChange={(content) => onEditorChange(content)}
      id={id}
      apiKey={editorApiKey}
      onInit={(_evt, editor) => (editorRef.current = editor)}
      initialValue={initialValue}
      init={{
        height: 500,
        // menubar: false,
        plugins: [
          'advlist',
          'autolink',
          'lists',
          'link',
          'image',
          'charmap',
          'codesample',
          'emoticons',
          'formatpainter',
          'linkchecker',
          'a11ychecker',
          'preview',
          'anchor',
          'searchreplace',
          'visualblocks',
          'code',
          'fullscreen',
          'tinymcespellchecker',
          'advcode',
          'editimage',
          'code',
          'autocorrect',
          ' typography',
          ' inlinecss',
          'markdown',
          'insertdatetime',
          'media',
          'table',
          'code',
          'help',
          'wordcount',
        ],
        toolbar:
          'code | visualblocks | undo redo | blocks fontfamily fontsize | ' +
          'bold italic forecolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | help',
        content_style:
          'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
      }}
    />
  );
};

export default TinyEditor;
