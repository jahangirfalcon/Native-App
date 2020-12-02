import Axios from "axios";
import React from "react";
import { View, Text, FlatList, StyleSheet, Button, Image } from "react-native";

class Users extends React.Component {
  state = {
    seed: 0,
    page: 1,
    users: [],
    isLoading: false,
    isRefreshing: false,
  };

  loadUsers = () => {
    const { users, seed } = this.state;
    this.setState({ isLoading: true });

    Axios.get(
      `http://192.168.1.101:5000/api/user/users?seed=${seed}&results=10`
    )
      .then((res) => {
        this.setState({
          users: [...users, ...res.data],
          isRefreshing: false,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  handleRefresh = () => {
    this.setState(
      {
        seed: this.state.seed + 10,
        isRefreshing: true,
      },
      () => {
        this.loadUsers();
      }
    );
  };

  handleLoadMore = () => {
    this.setState(
      {
        seed: this.state.seed + 10,
      },
      () => {
        this.loadUsers();
      }
    );
  };

  componentDidMount() {
    this.loadUsers();
  }

  render() {
    const { users, isRefreshing } = this.state;
    return (
      <View style={styles.scene}>
        <View
          style={{
            width: "20%",
            alignSelf: "flex-end",
            marginRight: "10%",
            marginBottom: 10,
          }}
        >
          <Button
            onPress={() => this.props.navigation.navigate("Form")}
            title="Add"
          />
        </View>
        {users && (
          <FlatList
            data={users}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <View
                    style={{
                      alignItems: "center",
                      marginBottom: "2%",
                    }}
                  >
                    <Image
                      source={{
                        uri: item.profile
                          ? `http://192.168.1.101:5000/${item.profile}`
                          : "https://image.shutterstock.com/image-photo/karachi-karachipakistan-july-24-2015-260nw-1460360153.jpg",
                      }}
                      style={{ width: 80, height: 80, borderRadius: 100 }}
                    />
                  </View>
                  <View>
                    <Text style={styles.title}>{item.name}</Text>
                    <Text
                      style={{
                        marginTop: "10%",
                        fontSize: 18,
                        marginLeft: "30%",
                      }}
                    >
                      {item.title}
                    </Text>
                  </View>
                </View>
                <Text style={{ marginLeft: "10%" }}>{item.description}</Text>
              </View>
            )}
            keyExtractor={(i) => i.email}
            refreshing={isRefreshing}
            onRefresh={this.handleRefresh}
            onEndReached={this.handleLoadMore}
            onEndThreshold={0}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    paddingTop: 25,
  },
  user: {
    width: "100%",
    backgroundColor: "#333",
    marginBottom: 10,
    paddingLeft: 25,
  },
  userName: {
    fontSize: 17,
    paddingVertical: 20,
    color: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: "10%",
  },
  item: {
    backgroundColor: "lightgray",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 15,
  },
  title: {
    fontSize: 20,
    marginLeft: "30%",
  },
});

export default Users;
