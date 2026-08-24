import { useEffect, useState } from 'react';
import Header from '../components/Header.jsx';
import Hero from '../components/Hero.jsx';
import LocalAtlas from '../components/LocalAtlas.jsx';
import RegionalMobilityField from '../components/RegionalMobilityField.jsx';
import WardEcology from '../components/WardEcology.jsx';
import InfrastructureLandscape from '../components/InfrastructureLandscape.jsx';
import ParticipatoryResources from '../components/ParticipatoryResources.jsx';
import MethodsNote from '../components/MethodsNote.jsx';
import { ErrorState, LoadingState } from '../components/LoadingState.jsx';
import { loadMusinaData } from '../utils/data.js';

export default function MainInterface() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    loadMusinaData()
      .then((loadedData) => {
        if (!ignore) setData(loadedData);
      })
      .catch((loadError) => {
        if (!ignore) setError(loadError);
      });

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="app-shell">
      <Header />
      <main className="main-content">
        {error && <ErrorState error={error} />}
        {!error && !data && <LoadingState />}
        {data && (
          <>
            <Hero metadata={data.metadata} />
            <RegionalMobilityField countrySummary={data.countrySummary} />
            <LocalAtlas wardsGeojson={data.wardsGeojson} blocksGeojson={data.blocksGeojson} />
            <InfrastructureLandscape
              wardsGeojson={data.wardsGeojson}
              blocksGeojson={data.blocksGeojson}
              infrastructureGeojson={data.infrastructureGeojson}
              nearestInfrastructure={data.nearestInfrastructure}
              petrolCandidatesGeojson={data.petrolCandidatesGeojson}
              petrolCandidates={data.petrolCandidates}
            />
            <ParticipatoryResources
              wardsGeojson={data.wardsGeojson}
              blocksGeojson={data.blocksGeojson}
              resourcesGeojson={data.participatoryResourcesGeojson}
              resources={data.participatoryResources}
              categorySummary={data.participatoryResourceCategorySummary}
            />
            <WardEcology wardSummary={data.wardSummary} />
            <MethodsNote metadata={data.metadata} />
          </>
        )}
      </main>
      <footer className="footer">
        Musina in Motion · survey interface · QA-checked data spine · block-level summaries are privacy-screened.
      </footer>
    </div>
  );
}
