import useGetOneData from 'hooks/useGetOneData';
import { ISubject } from 'models/subject';
import HeaderUserView from 'pages/users/components/vewHeader';
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom';
import Topics from '../components/topics';
import Attends from '../components/attends';
import StudentMark from '../components/student_mark';

const SubjectView: React.FC = (): JSX.Element => {
  const { t } = useTranslation();
  const { id } = useParams();

  const { data: subject, isFetching } = useGetOneData<ISubject>({
    queryKey: ["subjects", id],
    url: `subjects/${id}?expand=topics.subjectCategory,topic.parent`,
    options: {
      enabled: !!id,
    }
  });

  return (
    <div>
      <HeaderUserView
        title={subject?.data?.name ?? t("Subject")}
        breadCrumbData={[
          {
            name: "Home",
            path: "/"
          },
          {
            name: "Subjects",
            path: "/subjects"
          },
          {
            name: "Subject view",
            path: "/subjects/:id"
          },
        ]}
        tabs={[
          {
            key: "topics",
            label: t("Topics"),
            children: <><Topics id={id} topics={subject?.data?.topics ?? []} loading={isFetching} /></>
          },
          {
            key: "mark",
            label: t("O'zlashtirish"),
            children: <StudentMark id={id} />
          },
          {
            key: "attends",
            label: t("Attendance"),
            children: <><Attends id={id} /></>
          },
        ]}
      />
    </div>
  )
}

export default SubjectView