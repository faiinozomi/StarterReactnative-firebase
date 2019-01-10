import React from 'react';
import { StyleSheet, Text, View, StatusBar, ListView } from 'react-native';
import { Container, Content, Header, Form, Input, Item, Button, Label, Icon, List, ListItem } from 'native-base'
import * as firebase from 'firebase';

const firebaseConfig = {

  apiKey: "AIzaSyDu9PMn_hRTq2mjMlcsqoDar4-PoL-IS88",
  authDomain: "rnfbase-fe33b.firebaseapp.com",
  databaseURL: "https://rnfbase-fe33b.firebaseio.com",
  projectId: "rnfbase-fe33b",
  storageBucket: "rnfbase-fe33b.appspot.com",
  messagingSenderId: "843145184655"
};

firebase.initializeApp(firebaseConfig);

var data = []

export default class App extends React.Component {

  constructor(props) {
    super(props);

    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

    this.state = {
      listViewData: data,
      newContact: ""
    }

  }

  componentDidMount() {

    var that = this

    firebase.database().ref('/items').on('child_added', function (data) {

      var newData = [...that.state.listViewData]
      newData.push(data)
      that.setState({ listViewData: newData })

    })

  }

  addRow(data) {

    var key = firebase.database().ref('/items').push().key
    firebase.database().ref('/items').child(key).set({ name: data })
  }

  async deleteRow(secId, rowId, rowMap, data) {

    await firebase.database().ref('items/' + data.key).set(null)

    rowMap[`${secId}${rowId}`].props.closeRow();
    var newData = [...this.state.listViewData];
    newData.splice(rowId, 1)
    this.setState({ listViewData: newData });

  }

  showInformation() {

  }

  render() {
    return (
      <Container style={styles.container}>
        <Header style={{ marginTop: StatusBar.currentHeight }}>
          <Content>
            <Item>
              <Input
                onChangeText={(newContact) => this.setState({ newContact })}
                placeholder="Add name"
              />
              <Button onPress={() => this.addRow(this.state.newContact)}>
                <Icon name="add" />
              </Button>
            </Item>
          </Content>
        </Header>

        <Content>
          <List
            enableEmptySections
            dataSource={this.ds.cloneWithRows(this.state.listViewData)}
            renderRow={data =>
              <ListItem>
                <Text> {data.val().name}</Text>
              </ListItem>
            }
            renderLeftHiddenRow={data =>
              <Button full onPress={() => this.addRow(data)} >
                <Icon name="information-circle" />
              </Button>
            }
            renderRightHiddenRow={(data, secId, rowId, rowMap) =>
              <Button full danger onPress={() => this.deleteRow(secId, rowId, rowMap, data)}>
                <Icon name="trash" />
              </Button>

            }

            leftOpenValue={-75}
            rightOpenValue={-75}

          />

        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',

  },
});

// const AppNavigator = StackNavigator({
//   LoginScreen: { screen: LoginScreen },
//   SendPushNotificationScreen: { screen: SendPushNotification }
// })

// export default AppNavigator
