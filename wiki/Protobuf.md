# What is ProtoBuf??



Protobuf is platform-independent, extensible mechanism for serializing and deserializing data. It's like JSON but shorter, faster, and more efficient. Also generates native language bindings. Native language bindings are like making models for each language.

We write .proto files and then protobuf compiler generates the interfaces and classes for our proto models in native language bindings.

We create a simple model in proto inside a .proto file.

This is a simple message we represent each parameter with unique integer.

```
message Person {
  optional string name = 1;
  optional int32 id = 2;
  optional string email = 3;
}
```

And then protobuf compiler generates the native language bindings for our proto model we can then create their objects in our language.

```
Person john = Person.newBuilder()
    .setId(1234)
    .setName("John Doe")
    .setEmail("jdoe@example.com")
    .build();
```

# Style Guide

- We follow the [Protobuf Style Guide](https://developers.google.com/protocol-buffers/docs/style).
- Keep line lengths to 80 characters.
- Use 2 spaces for indentation.
- Use double quotes for strings.
- Protobuf files should be named in all lowercase interaction_object.proto .
- Imports should be sorted.
- CamelCase should be used for message names and underscore_seperated_names for message fields.

# Language Guide

- We follow the [Protobuf Language Guide](https://developers.google.com/protocol-buffers/docs/proto3).
- Always keep the filed integers for a proto different and never change them after declarations keep them same.
- Always define proper types to a field and be sure to keep the filed repeated if it's going to be repeated.
- Kotlin style comments can be used in protos so be sure to leave your messages well commented.
- If your'e about to change a proto field or remove it use reserved field and make that variable reserved so that you can never use it again and it will be a compile error.
- Like in java we have default values when a variable is not initialized similarly in protobuf we have default values when a field is not set for example a string will have "" and integer will have 0 .
- As we have discussed earlier use of enumerations is also possible in protobuf. You can clearly see it in the example below.

```
enum CheckpointState {
  // The state of checkpoint is unknown.
  CHECKPOINT_STATE_UNSPECIFIED = 0;

  // Progress made in the exploration is saved and the size of the checkpoint database has
  // not exceeded the allocated limit.
  CHECKPOINT_SAVED_DATABASE_NOT_EXCEEDED_LIMIT = 1;

  // Progress made in the exploration is saved and the size of the checkpoint database has
  // exceeded the allocated limit.
  CHECKPOINT_SAVED_DATABASE_EXCEEDED_LIMIT = 2;

  // Progress made in the exploration is not saved.
  CHECKPOINT_UNSAVED = 3;
}
```
You can later use this in a protobuf message as a field or directly define this enum in you proto message.

# Its Usage in Oppia Android
Protobuf is mainly used in oppia for defing models for diffrent use cases in oppia supporse for defineing a lesson type which we typically call in oppia a exploration.

Using protobuf as model types helps a lot as it can compile to any language and models are common to both the android app and the backend server.

Apart from this protofuf is also currently used for passing data between the intents directly via protobuf model instead of using bundles and using a key for them this proves to be very profient and less code and it's reusablity is achived.

Below is an example of use case proto code in [exploration.proto](https://github.com/oppia/oppia-android/blob/a7c8e6cab5107c70f56ca5c8d8c0f7286f8b7150/model/src/main/proto/exploration.proto)
```
message Exploration {
  // The ID of the exploration.
  string id = 1;

  // Mapping from a state name to a state object
  map<string, State> states = 2;
  repeated ParamChange param_changes = 3;
  repeated ParamSpec param_specs = 4;
  string init_state_name = 5;
  string objective = 6;
  bool correctness_feedback_enabled = 7;
  string title = 8;
  string language_code = 9;
  int32 version = 10;
}
```
You can see that here all the integers in the fields are unique and they don't need to be changed after defining them becasue this is parsed onto the networks requests and both sides agree on this format if you change the integers later then order of them will change and it will not work.

This is the good thing about protos you don't need to define the fields types which make faster and more efficient data transfer.

You can also see that protos are used for defining a proto field which can be done you can also define enums inside the protos.

```
message ParamChange {
  string generator_id = 1;
  string name = 2;
  ParamChangeCustomizationArgs customization_args = 3;
}repeated ParamChange param_changes = 3;
```

