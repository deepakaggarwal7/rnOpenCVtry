package com.reactlibrary;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;

import org.opencv.core.CvType;
import org.opencv.core.Mat;

import org.opencv.android.Utils;

import org.opencv.imgproc.Imgproc;

import android.util.Base64;

import java.io.ByteArrayOutputStream;


public class RNOpenCvLibraryModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    public RNOpenCvLibraryModule(ReactApplicationContext reactContext) {
        
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "RNOpenCvLibrary";
    }

    @ReactMethod
    public void checkForBlurryImage(String imageAsBase64, Callback errorCallback, Callback successCallback) {
        try {
            BitmapFactory.Options options = new BitmapFactory.Options();
            options.inDither = true;
            options.inPreferredConfig = Bitmap.Config.ARGB_8888;

            byte[] decodedString = Base64.decode(imageAsBase64, Base64.DEFAULT);
            Bitmap image = BitmapFactory.decodeByteArray(decodedString, 0, decodedString.length);


//      Bitmap image = decodeSampledBitmapFromFile(imageurl, 2000, 2000);
            int l = CvType.CV_8UC1; //8-bit grey scale image
            Mat matImage = new Mat();
            Utils.bitmapToMat(image, matImage);
            Mat matImageGrey = new Mat();
            Imgproc.cvtColor(matImage, matImageGrey, Imgproc.COLOR_BGR2GRAY);

            Bitmap destImage;
            destImage = Bitmap.createBitmap(image);
            Mat dst2 = new Mat();
            Utils.bitmapToMat(destImage, dst2);
            Mat laplacianImage = new Mat();
            dst2.convertTo(laplacianImage, l);
            Imgproc.Laplacian(matImageGrey, laplacianImage, CvType.CV_8U);
            Mat laplacianImage8bit = new Mat();
            laplacianImage.convertTo(laplacianImage8bit, l);

            Bitmap bmp = Bitmap.createBitmap(laplacianImage8bit.cols(), laplacianImage8bit.rows(), Bitmap.Config.ARGB_8888);
            Utils.matToBitmap(laplacianImage8bit, bmp);
            int[] pixels = new int[bmp.getHeight() * bmp.getWidth()];
            bmp.getPixels(pixels, 0, bmp.getWidth(), 0, 0, bmp.getWidth(), bmp.getHeight());
            int maxLap = -16777216; // 16m
            for (int pixel : pixels) {
                if (pixel > maxLap)
                    maxLap = pixel;
            }

//            int soglia = -6118750;
            int soglia = -8118750;
            if (maxLap <= soglia) {
                System.out.println("is blur image");
            }

            successCallback.invoke(maxLap <= soglia);
        } catch (Exception e) {
            errorCallback.invoke(e.getMessage());
        }
    }

    public static byte[] Mat2Bytes(Mat mat){
        byte[] b = new byte[mat.channels() * mat.cols() * mat.rows()];
        mat.get(0, 0, b);
        return b;
    }

    @ReactMethod
    public void covertToBlackAndWhite(String imageAsBase64, Callback errorCallback, Callback successCallback) {
        try {
            BitmapFactory.Options options = new BitmapFactory.Options();
            options.inDither = true;
            options.inPreferredConfig = Bitmap.Config.ARGB_8888;

            byte[] decodedString = Base64.decode(imageAsBase64, Base64.DEFAULT);
            Bitmap sourceBitmap = BitmapFactory.decodeByteArray(decodedString, 0, decodedString.length);

            Mat tmp = new Mat (sourceBitmap.getWidth(), sourceBitmap.getHeight(), CvType.CV_8UC1);
            Utils.bitmapToMat(sourceBitmap, tmp);

            Mat grayMat = new Mat();
            Imgproc.cvtColor(tmp, grayMat, Imgproc.COLOR_BGR2GRAY);



            //Mat result = new Mat();
            //adaptiveThreshold(tmp, result, 255, ADAPTIVE_THRESH_MEAN_C, THRESH_BINARY, 15, 40);
            //byte[] newImage = Mat2Bytes(matImageGrey);
            //String bwImage = Base64.encodeToString(decodedString,Base64.DEFAULT);

            Utils.matToBitmap(grayMat, sourceBitmap);

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            sourceBitmap.compress(Bitmap.CompressFormat.PNG, 100, outputStream);
            String bwImageBas64 =  Base64.encodeToString(outputStream.toByteArray(), Base64.DEFAULT);
            successCallback.invoke(bwImageBas64);
        } catch(Exception e){
            errorCallback.invoke(e.getMessage());
        }

    }
}