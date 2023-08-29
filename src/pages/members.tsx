import React from 'react'
import styles from '../styles/base.module.css'
import NavigationBar from '../components/navigation-bar'
import Footer from '../components/footer'
import { ClubPosition, ClubPositionTitle, Member, clubPositionOrder, members } from '@/data/members-info'
import Image from 'next/image'
import defaultAvatar from '../images/members/eboard-default.png'

type DisplayMember = {
  name: string
  graduationYear: number | null
  position: ClubPositionTitle
  rawData: Member
}

function findStartYear() {
  let startYear: number = Infinity

  members.forEach((m: Member) => {
    m.positions.forEach((p: ClubPosition) => {
      startYear = Math.min(p.startYear, startYear)
    })
  })

  return startYear
}

function findEndYear() {
  let endYear: number = -Infinity

  members.forEach((m: Member) => {
    m.positions.forEach((p: ClubPosition) => {
      endYear = Math.max(p.endYear, endYear)
    })
  })

  return endYear
}

interface IMemberCard {
  displayMember: DisplayMember
}

function MemberCard(props: IMemberCard) {
  return (
    <div
      style={{
        backgroundColor: '#fafafa',
        margin: '15px',
        padding: '10px',
        width: '200px',
        borderRadius: '10px',
      }}
    >
      <Image
        src={props.displayMember.rawData.image == null ? defaultAvatar : props.displayMember.rawData.image.src}
        width={170}
        height={170}
        alt={`Image of ${props.displayMember.name}`}
        style={{ borderRadius: '10px', margin: '10px', marginBottom: '0' }}
      />
      <div style={{ height: '65px' }}>
        <p style={{ marginBottom: '0', fontWeight: 'bold' }}>{props.displayMember.name}</p>
        <p style={{ margin: '0' }}>{props.displayMember.position}</p>
      </div>
      <p>Class of {props.displayMember.graduationYear}</p>
    </div>
  )
}

function getMembersFromYear(year: number) {
  let outValue: Array<DisplayMember> = []
  members.map((member: Member, i: number) => {
    member.positions.map((position: ClubPosition, ii: number) => {
      if (position.startYear == year) {
        const displayMember: DisplayMember = {
          name: `${member.firstName} ${member.lastName}`,
          graduationYear: member.graduationYear,
          position: position.titleName,
          rawData: member,
        }
        outValue.push(displayMember)
      }
    })
  })
  return outValue
}

interface IMemberRow {
  startYear: number
}

function MemberRow(props: IMemberRow) {
  let members: Array<DisplayMember> = getMembersFromYear(props.startYear)
  members = members.sort((a, b) => clubPositionOrder.indexOf(a.position) - clubPositionOrder.indexOf(b.position))

  return (
    <div>
      <p style={{ fontSize: '2.15rem', fontWeight: 'bolder', textAlign: 'left', marginBottom: '0', color: '#a51f1f' }}>
        {props.startYear} - {props.startYear + 1}
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'left' }}>
        {members.map((displayMember: DisplayMember, i: number) => {
          return <MemberCard displayMember={displayMember} key={i} />
        })}
      </div>
    </div>
  )
}

export default function HomePage() {
  const startYear: number = findStartYear()
  const endYear: number = findEndYear()

  return (
    <>
      <main className={styles['base']}>
        <NavigationBar />
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '80%' }}>
            <div>
              <p style={{ fontWeight: 'bolder', fontSize: '2.6rem', marginBottom: '0', color: '#a51f1f' }}>
                Rutgers Esports Executive Board & Alumni
              </p>
              <p>
                Positions older than 2022 may not be accurate as there are no records of previous members stored other
                than the wayback machine from the legacy website and reaching out to alumni to recall their memories.
                Members might also not have correct titles due to promotions or impeachments during the school year;
                only their final position title is shown. If you are in this list and wish to be removed or edited, send
                us an email: ruesportshr@gmail.com
              </p>
              {Array(endYear - startYear)
                .fill('_')
                .map((_: number, i: number) => {
                  const currentYear: number = endYear - i
                  return <MemberRow startYear={currentYear - 1} key={i} />
                })}
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </>
  )
}
