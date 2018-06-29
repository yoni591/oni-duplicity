import * as React from "react";
import { connect } from "react-redux";

import mapStateToProps, { StateProps } from "./derived-state";
import mapDispatchToProps, { DispatchProps } from "./events";

import NoSave from "@/pages/NoSave";
import Error from "@/pages/Error";
import Loading from "@/pages/Loading";
import Saving from "@/pages/Saving";
import SaveEditor from "@/pages/SaveEditor";

import AppContainer from "./components/AppContainer";
import AppContent from "./components/AppContent";
import NavBarContainer from "./components/NavBar";

type Props = StateProps & DispatchProps;
class App extends React.Component<Props> {
  render() {
    const { error, loadingState, onDismissError } = this.props;

    let element: JSX.Element;

    if (error) {
      element = <Error error={error} onDismiss={onDismissError} />;
    } else {
      switch (loadingState) {
        case "idle":
          element = <NoSave />;
          break;
        case "loading":
          element = <Loading />;
          break;
        case "saving":
          element = <Saving />;
          break;
        case "ready":
          element = <SaveEditor />;
          break;
        default:
          element = <div>???</div>;
          break;
      }
    }

    return (
      <AppContainer>
        <NavBarContainer />
        <AppContent>{element}</AppContent>
      </AppContainer>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
