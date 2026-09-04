import Header from "./components/Header";
import StatusCard from "./components/StatusCard";
import VideoInfo from "./components/VideoInfo";
import TimeSelection from "./components/TimeSelection";
import RecordingType from "./components/RecordingType";
import DownloadType from "./components/DownloadType";
import RecordingControls from "./components/RecordingControls";
import ConversionProgress from "./components/ConversionProgress";

function App() {
  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <Header />
      <StatusCard />
      <VideoInfo />
      <TimeSelection />
      <RecordingType />
      <DownloadType />
      <RecordingControls />
      <ConversionProgress />
    </main>
  );
}

export default App;