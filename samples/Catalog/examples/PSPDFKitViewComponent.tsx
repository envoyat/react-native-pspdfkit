import React from 'react';
import { Alert, Button, processColor, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import PSPDFKitView from 'react-native-pspdfkit';
import RNFS from 'react-native-fs';

import { exampleDocumentPath, pspdfkitColor, writableXFDFPath } from '../configuration/Constants';
import { BaseExampleAutoHidingHeaderComponent } from '../helpers/BaseExampleAutoHidingHeaderComponent';
import { hideToolbar } from '../helpers/NavigationHelper';
import { PSPDFKit } from '../helpers/PSPDFKit';

export class PSPDFKitViewComponent extends BaseExampleAutoHidingHeaderComponent {
  pdfRef: React.RefObject<PSPDFKitView | null>;

  constructor(props: any) {
    super(props);
    const { navigation } = this.props;
    this.pdfRef = React.createRef();
    hideToolbar(navigation);
  }
  
  override render() {
    const { navigation } = this.props;

    return (
      <View style={styles.flex}>
        <PSPDFKitView
          ref={this.pdfRef}
          document={exampleDocumentPath}
          configuration={{
            iOSAllowToolbarTitleChange: false,
            toolbarTitle: 'My Awesome Report',
            iOSBackgroundColor: processColor('lightgrey'),
            iOSUseParentNavigationBar: false,
          }}
          fragmentTag="PDF1"
          showNavigationButtonInToolbar={true}
          onNavigationButtonClicked={() => navigation.goBack()}
          style={styles.pdfColor}
        />
        <SafeAreaView>
          <View style={styles.column}>
            <View>
              <View style={styles.horizontalContainer}>
                <TouchableOpacity onPress={ async () => {
                  const document = this.pdfRef.current?.getDocument();
                  Alert.alert(
                    'PSPDFKit',
                    'Document ID: ' + await document?.getDocumentId(),
                  );
                }}>
                  <Text style={styles.button}>{'Get Document ID'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={ async () => {
                  const documentProperties = await PSPDFKit.getDocumentProperties(exampleDocumentPath);
                  Alert.alert('PSPDFKit', 
                    'Document Properties: ' + JSON.stringify(documentProperties));
                    console.log('Document Properties: ', documentProperties);
                }}>
                  <Text style={styles.button}>{'Get Document Props'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }
}
const styles = {
  flex: { flex: 1 },
  pdfColor: { flex: 1, color: pspdfkitColor },
  column: {
    flexDirection: 'column' as 'column',
    alignItems: 'center' as 'center',
  },
  horizontalContainer: {
    flexDirection: 'row' as 'row',
    minWidth: '70%' as '70%',
    height: 50,
    justifyContent: 'space-between' as 'space-between',
    alignItems: 'center' as 'center',
  },
  button: {
    padding: 15,
    flex: 1,
    fontSize: 16,
    color: pspdfkitColor,
    textAlign: 'center' as 'center',
  },
};
