package com.iatesting;
import android.graphics.Rect;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import com.google.mlkit.vision.common.InputImage;
import com.google.mlkit.vision.label.ImageLabel;
import com.google.mlkit.vision.label.ImageLabeler;
import com.google.mlkit.vision.label.ImageLabeling;
import com.google.mlkit.vision.label.defaults.ImageLabelerOptions;
import com.google.mlkit.vision.text.Text;
import com.google.mlkit.vision.text.TextRecognition;
import com.google.mlkit.vision.text.TextRecognizer;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

public class MLKitModule extends ReactContextBaseJavaModule{
    private final ReactApplicationContext reactContext;
    private TextRecognizer textDetector;
    private ImageLabeler labeler;

    MLKitModule(ReactApplicationContext context) {
        super(context);
        this.reactContext = context;
    }

    @ReactMethod
    public void deviceTextRecognition(String uri, final Promise promise) {
        Log.d("MLKit module", "Called mlkit modue");
        try {
            InputImage image = InputImage.fromFilePath(this.reactContext, android.net.Uri.parse(uri));
            TextRecognizer detector = this.getTextRecognizerInstance();
            Task<Text> result = detector.process(image).addOnSuccessListener(new OnSuccessListener<Text>() {
                @Override
                public void onSuccess(Text visionText) {
                    promise.resolve(processDeviceResult(visionText));
                }
            }).addOnFailureListener(new OnFailureListener() {
                @Override
                public void onFailure(@NonNull Exception e) {
                    e.printStackTrace();
                    promise.reject(e);
                }
            });
        } catch (IOException e) {
            promise.reject(e);
            e.printStackTrace();
        }
    }

    @ReactMethod
    public void deviceImageLabeling(String uri, final Promise promise) {
        try {
            InputImage image = InputImage.fromFilePath(this.reactContext, android.net.Uri.parse(uri));
            ImageLabeler labeler = this.getImageLabelerInstance();
            labeler.process(image).addOnSuccessListener(new OnSuccessListener<List<ImageLabel>>() {
                @Override
                public void onSuccess(List<ImageLabel> imageLabels) {
                    promise.resolve(processImageLabelingDeviceResults(imageLabels));
                }
            }).addOnFailureListener(new OnFailureListener() {
                @Override
                public void onFailure(@NonNull Exception e) {
                    e.printStackTrace();
                    promise.reject(e);
                }
            });
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private TextRecognizer getTextRecognizerInstance() {
        if(this.textDetector == null) {
            this.textDetector = TextRecognition.getClient();
        }

        return this.textDetector;
    }

    private ImageLabeler getImageLabelerInstance() {
        if(this.labeler == null) {
            this.labeler = ImageLabeling.getClient(ImageLabelerOptions.DEFAULT_OPTIONS);
        }

        return this.labeler;
    }

    @ReactMethod
    public void close(final Promise promise) throws IOException {
        if(this.textDetector != null) {
            this.textDetector.close();
            this.textDetector = null;
            promise.resolve(true);
        }

        if(this.labeler != null) {
            this.labeler.close();
            this.labeler = null;
            promise.resolve(true);
        }
    }

    /**
     * Converts firebaseVisionText into a map
     *
     * @param firebaseVisionText
     * @return
     */
    private WritableArray processDeviceResult(Text firebaseVisionText) {
        WritableArray data = Arguments.createArray();
        WritableMap info = Arguments.createMap();
        WritableMap coordinates = Arguments.createMap();
        List<Text.TextBlock> blocks = firebaseVisionText.getTextBlocks();

        if (blocks.size() == 0) {
            return data;
        }

        for (int i = 0; i < blocks.size(); i++) {
            List<Text.Line> lines = blocks.get(i).getLines();
            info = Arguments.createMap();
            coordinates = Arguments.createMap();

            Rect boundingBox = blocks.get(i).getBoundingBox();

            coordinates.putInt("top", boundingBox.top);
            coordinates.putInt("left", boundingBox.left);
            coordinates.putInt("width", boundingBox.width());
            coordinates.putInt("height", boundingBox.height());

            info.putMap("blockCoordinates", coordinates);
            info.putString("blockText", blocks.get(i).getText());
            info.putString("resultText", firebaseVisionText.getText());

            for (int j = 0; j < lines.size(); j++) {
                List<Text.Element> elements = lines.get(j).getElements();
                info.putString("lineText", lines.get(j).getText());

                for (int k = 0; k < elements.size(); k++) {
                    info.putString("elementText", elements.get(k).getText());
                }
            }

            data.pushMap(info);
        }

        return data;
    }

    /**
     * Converts labels into a map
     *
     * @param labels
     * @return
     */
    private WritableArray processImageLabelingDeviceResults(List<ImageLabel> labels) {
        WritableArray data = Arguments.createArray();
        WritableMap info = Arguments.createMap();

        if (labels.size() == 0) {
            return data;
        }

        for (ImageLabel label : labels) {
            info = Arguments.createMap();
            info.putString("description", label.getText());
            info.putInt("index", label.getIndex());
            info.putDouble("confidence", label.getConfidence());
            data.pushMap(info);
        }

        return data;
    }

    public String getName() {
        return "MLKitModule";
    }
}
