import SunBackground from './components/SunBackground';

export default function GamePage() {
  return (
    <>
      <SunBackground duration={60} />
      
      {/* כל התוכן שלך פה - יהיה מעל הרקע */}
      <div className="relative z-10">
        <h1>Tenses</h1>
      </div>
    </>
  );
}