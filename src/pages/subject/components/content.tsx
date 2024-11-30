import { Card } from 'antd';
import { ISubjectContent } from 'models/subject';
import React, { useState, useRef } from 'react';
import FileViewer from 'components/FileViewer/file_viewer';
import { useTranslation } from 'react-i18next';

type ContentPropsType = {
  content: ISubjectContent,
}

const Content: React.FC<ContentPropsType> = ({ content }): JSX.Element => {
  const { t } = useTranslation();
  const content_ref = useRef<any>();

  return (
    <Card
      ref={content_ref}
      className={`relative p-0 border-transparent`}
      bodyStyle={{ padding: 0 }}
      headStyle={{ padding: 0 }}
      type="inner"
    >
      <div className='p-3 max-md:px-2'>
        <div>
          {
            content?.type === 1 ?
              <div dangerouslySetInnerHTML={{ __html: content?.text ?? "" }} />
              : <div>
                <FileViewer file={content?.file ?? ""} description={!content?.file?.split(".")?.reverse()[0]?.includes("pdf") ? content?.description ?? "" : ""} />
                {content?.description && (content?.types?.type !== "FILE" || (content?.types?.type === "FILE" && content?.file?.split(".")?.reverse()[0]?.includes("pdf"))) ? <div className="mt-3">
                  <b className='font-samibold text-gray-400'>&nbsp;&nbsp;{t("Description")}:</b>&nbsp;
                  <span>{content?.description}</span>
                </div> : null}
              </div>
          }
        </div>
      </div>
    </Card>
  );
};

export default Content;